import * as cheerio from 'cheerio';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface GameMatch {
  title: string;
  link: string | undefined;
  score: number;
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTeamNames(gameId: string): string[] {
  // Normalize and split by common separators (vs, @, vs., etc.)
  const normalized = normalizeString(gameId);
  const separators = [' vs ', ' vs. ', ' @ ', ' at ', ' - '];
  
  for (const sep of separators) {
    if (normalized.includes(sep)) {
      return normalized.split(sep).map(team => team.trim());
    }
  }
  
  // If no separator found, try to extract team names from common patterns
  // For now, return the whole string as a single "team" to match against
  return [normalized];
}

function calculateSimilarityScore(gameId: string, title: string): number {
  const normalizedGameId = normalizeString(gameId);
  const normalizedTitle = normalizeString(title);
  
  let score = 0;
  
  // Exact match (highest score)
  if (normalizedGameId === normalizedTitle) {
    return 100;
  }
  
  // Check if title contains the entire gameId
  if (normalizedTitle.includes(normalizedGameId)) {
    score += 50;
  }
  
  // Check if gameId contains the entire title
  if (normalizedGameId.includes(normalizedTitle)) {
    score += 40;
  }
  
  // Extract team names from gameId
  const teams = extractTeamNames(gameId);
  
  // Count how many team names appear in the title
  let teamMatches = 0;
  for (const team of teams) {
    if (team && normalizedTitle.includes(team)) {
      teamMatches++;
      // Longer team names get more weight
      score += team.length * 2;
    }
  }
  
  // Bonus if all teams match
  if (teams.length > 0 && teamMatches === teams.length) {
    score += 30;
  }
  
  // Word-by-word matching
  const gameIdWords = normalizedGameId.split(/\s+/);
  const titleWords = normalizedTitle.split(/\s+/);
  
  let matchingWords = 0;
  for (const word of gameIdWords) {
    if (word.length > 2 && titleWords.includes(word)) {
      matchingWords++;
      score += word.length;
    }
  }
  
  // Calculate word match percentage
  if (gameIdWords.length > 0) {
    const wordMatchPercentage = (matchingWords / gameIdWords.length) * 20;
    score += wordMatchPercentage;
  }
  
  // Levenshtein-like scoring for partial matches
  const longerLength = Math.max(normalizedGameId.length, normalizedTitle.length);
  if (longerLength > 0) {
    // Simple character overlap calculation
    const commonChars = [...normalizedGameId].filter(char => 
      normalizedTitle.includes(char)
    ).length;
    const charOverlapScore = (commonChars / longerLength) * 10;
    score += charOverlapScore;
  }
  
  return Math.min(score, 100); // Cap at 100
}

function findMostSimilarGame(
  gameId: string,
  gameList: { title: string; link: string | undefined; }[]
): GameMatch | null {
  if (!gameId || gameList.length === 0) {
    return null;
  }
  
  const scoredGames: GameMatch[] = gameList.map(game => ({
    title: game.title,
    link: game.link,
    score: calculateSimilarityScore(gameId, game.title),
  }));
  
  // Sort by score descending
  scoredGames.sort((a, b) => b.score - a.score);
  
  // Return the best match (or null if score is too low)
  const bestMatch = scoredGames[0];
  return bestMatch && bestMatch.score > 0 ? bestMatch : null;
}

function extractGameData(htmlContent: string) {
  // Load the HTML content into Cheerio
  const $ = cheerio.load(htmlContent);

  const entrySelector = '.content .short_item.block_elem';

  const gameList: { title: string; link: string | undefined; }[] = [];

  $(entrySelector).each((i, element) => {
    const anchor = $(element).find('.short_content h3 a');
    if (anchor.length) {
      const title = anchor.text().trim();
      const link = anchor.attr('href');

      gameList.push({
        title: title,
        link: link
      });
    }
  });

  return gameList;
}

function extractVideoData(htmlContent: string) {
  const $ = cheerio.load(htmlContent);
  const videoList: { link: string }[] = [];
  const videoSelector = 'a';
  $(videoSelector).each((i, element) => {
    const link = $(element).attr('href');
    if (link?.includes('https://gamesontvtoday.com')) {
      videoList.push({
        link: link ?? ''
      });
    };
  });
  return videoList;
}

async function getGameLink(link: string) {
  const response = await fetch(`https://basketball-video.com${link}`);
  const html = await response.text();
  const gameLink = extractVideoData(html);
  return gameLink;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');
  const response = await fetch('https://basketball-video.com/videos/nba_video/los_angeles_lakers_full_game_replay_highlights/24');
  const html = await response.text();
  console.log('html', html);
  const gameList = extractGameData(html);
  console.log('gameList', gameList);
  const matchedGame = findMostSimilarGame(gameId!, gameList);
  console.log('matchedGame', matchedGame);
  const gameLink = await getGameLink(matchedGame?.link ?? '');
  if (gameLink) {
    return new Response(JSON.stringify(gameLink));
  }
  return new Response(JSON.stringify(gameList));
}