var CredentialedGithubApiService = Conductor.Oasis.Service.extend({
  requests: {
    ajax: function(promise, ajaxOpts) {
      //TODO: prepend github domain
      //TODO: add access_token
      //TODO: make an actual ajax request
      promise.resolve([{
        "id": 1296269,
        "owner": {
          "login": "octocat",
          "id": 1,
          "avatar_url": "https://github.com/images/error/octocat_happy.gif",
          "gravatar_id": "somehexcode",
          "url": "https://api.github.com/users/octocat"
        },
        "name": "Hello-World",
        "full_name": "octocat/Hello-World",
        "description": "This your first repo!",
        "private": false,
        "fork": false,
        "url": "https://api.github.com/repos/octocat/Hello-World",
        "html_url": "https://github.com/octocat/Hello-World",
        "clone_url": "https://github.com/octocat/Hello-World.git",
        "git_url": "git://github.com/octocat/Hello-World.git",
        "ssh_url": "git@github.com:octocat/Hello-World.git",
        "svn_url": "https://svn.github.com/octocat/Hello-World",
        "mirror_url": "git://git.example.com/octocat/Hello-World",
        "homepage": "https://github.com",
        "language": null,
        "forks": 9,
        "forks_count": 9,
        "watchers": 80,
        "watchers_count": 80,
        "size": 108,
        "master_branch": "master",
        "open_issues": 0,
        "pushed_at": "2011-01-26T19:06:43Z",
        "created_at": "2011-01-26T19:01:12Z",
        "updated_at": "2011-01-26T19:14:43Z"
      }]);
    }
  }
});

export = CredentialedGithubApiService;
