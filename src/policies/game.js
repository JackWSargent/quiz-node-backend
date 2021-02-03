const ApplicationPolicy = require("./application");
module.exports = class GamePolicy extends (
	ApplicationPolicy
) {
	getGame() {
		return this._isAdmin() || this._isMember();
	}
	new() {
		return this._isAdmin();
	}
	create() {
		return this.new();
	}
	edit() {
		return this._isAdmin();
	}
	update() {
		return this.edit();
	}
	destroy() {
		return this.edit();
	}
};
