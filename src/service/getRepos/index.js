

const samsaoReposUrl = 'https://api.github.com/orgs/samsao/repos';

function getRepos(url) {
    return fetch(url);
}

function handleFetchResponse(fetchResponse) {
    let newResponse;
    try {
        return fetchResponse.then((response) => {
            newResponse = response;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
            } 
            else {
                console.log('Unable to get JSON data.');
            }
        }).then((responseBody) => {
            if (newResponse.status !== 200) {
               console.log('Unable to fetch data.');
            }
            return responseBody;
        });
    } catch (error) {
        console.error('handleFetchResponse:error', error);
    }
}


function listRepos() {
    return handleFetchResponse(getRepos(samsaoReposUrl))
    .then((repos) => {
        return repos.map((repo) => {
            let obj = {};
            obj.full_name = repo.full_name;
            obj.updated_at = repo.updated_at;
            obj.language = repo.language;
            obj.default_branch = repo.default_branch;
            obj.forks_count = repo.forks_count;
            return obj;
        })
    })
}

export {listRepos};
