const ApplicationPolicy = require("./application");
export default class AnswerPolicy extends ApplicationPolicy {
	new() {
		return this._isMember() || this._isAdmin();
	}
	create() {
		return this.new();
	}
	edit() {
		return this._isMember() || this._isAdmin();
	}
	update() {
		return this.edit();
	}
	destroy() {
		return this.update();
	}
}
