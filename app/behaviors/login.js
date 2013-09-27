import ajax from 'glazier/app/utils/ajax';

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

export default login;