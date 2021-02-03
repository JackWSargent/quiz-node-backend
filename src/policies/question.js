const ApplicationPolicy = require("./application");
module.exports = class QuestionPolicy extends (
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
		return this._isMember() || this._isAdmin();
	}
	update() {
		return this._isAdmin();
	}
	destroy() {
		return this._isAdmin();
	}
};
