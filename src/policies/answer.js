const ApplicationPolicy = require("./application");
module.exports = class AnswerPolicy extends (
	ApplicationPolicy
) {
	new() {
		return this._isAdmin();
	}
	create() {
		return this._isAdmin();
	}
	edit() {
		return this._isAdmin();
	}
	show() {
		return this._isAdmin() || this._isMember();
	}
	update() {
		return this._isAdmin();
	}
	destroy() {
		return this._isAdmin();
	}
};
