import ajax from 'glazier/utils/ajax';
// this file is overriden by ziniki

function login() {
  var userId = getUserIdFromCookie();

  if (!userId) {
    // no cookie yet - not logged in
    return Ember.RSVP.resolve();
  }

  return ajax({
    url: '/api/user',
    dataType: 'json'
  });
}

function getUserIdFromCookie(){
  var cookies = document.cookie.split(/\s*;\s*/);
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i],
        match = /^login=.+?\-(.+)/.exec(cookie);
    if (match) {
      return JSON.parse(decodeURIComponent(match[1])).github_id;
    }
  }
  return null;
}

export default login;
