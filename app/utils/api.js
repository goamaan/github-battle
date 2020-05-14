const id = '0a13d92ea864779ea67a';
const sec = '60e77c3915ce142e8f7e1bce0c7d48aa89ba6bb7';
const params = `?client_id=${id}&client_secret=${sec}`;

function getErrorMsg(message, username) {
  if (message === 'Not Found') {
    return `${username} doesn't exist`;
  }

  return message;
}

function getProfile(username) {
  return fetch(`https://api.github.com/users/${username}${params}`)
    .then((res) => res.json())
    .then((profile) => {
      if (profile.message) {
        throw new Error(getErrorMsg(profile.message, username));
      }

      return profile;
    });
}

function getRepos(username) {
  return fetch(
    `https://api.github.com/users/${username}/repos${params}&per_page=100`
  )
    .then((res) => res.json())
    .then((repos) => {
      if (repos.message) {
        throw new Error(getErrorMsg(repos.message, username));
      }

      return repos;
    });
}

// function getCommits(username) {
//   const totalCommits = [];
//   getRepos(username.login).then((repos) => {
//     repos.forEach((repo) => {
//       return fetch(
//         `https://api.github.com/repos/${username.login}/${repo.name}/commits${params}`
//       )
//         .then((res) => res.json())
//         .then((commits) => {
//           if (commits.message) {
//             throw new Error(getErrorMsg(commits.message, username));
//           }
//           totalCommits.push(commits);
//         });
//     });
//   });
//   return totalCommits;
// }

// function getCommitsCount(repoCommits) {
//   let counter = 0;
//   console.log(repoCommits);
//   repoCommits.forEach((repo) => {
//     repo.forEach((commit) => {
//       console.log(counter);
//       counter++;
//     });
//   });
//   return counter;
// }

function getStarCount(repos) {
  return repos.reduce(
    (count, { stargazers_count }) => count + stargazers_count,
    0
  );
}

function calculateScore(followers, repos, profile) {
  return followers * 3 + getStarCount(repos);
}

function getUserData(player) {
  return Promise.all([getProfile(player), getRepos(player)]).then(
    ([profile, repos]) => ({
      profile,
      score: calculateScore(profile.followers, repos, profile),
    })
  );
}

function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score);
}

export function battle(players) {
  return Promise.all([
    getUserData(players[0]),
    getUserData(players[1]),
  ]).then((results) => sortPlayers(results));
}

export function fetchPopularRepos(language) {
  const endpoint = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      if (!data.items) {
        throw new Error(data.message);
      }

      return data.items;
    });
}
