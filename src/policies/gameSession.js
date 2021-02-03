const ApplicationPolicy = require("./application");
module.exports = class GameSessionPolicy extends (
	ApplicationPolicy
) {
	new() {
		return this._isMember() || this._isAdmin();
	}
	create() {
		return this._isMember() || this._isAdmin();
	}
	edit() {
		return this._isMember() || this._isAdmin();
	}
	show() {
		return this._isMember() || this._isAdmin();
	}
	update() {
		return this._isMember() || this._isAdmin();
	}
	destroy() {
		return this._isMember() || this._isAdmin();
	}
};
