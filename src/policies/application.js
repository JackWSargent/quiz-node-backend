module.exports = class ApplicationPolicy {
	constructor(user, record) {
		this.record = record;
		this.user = user;
	}
	_isOwner() {
		return this.record && this.record.userId == this.user.id;
	}
	_isAdmin() {
		return this.user && this.user.role == 1;
	}
	_isMember() {
		return this.user && this.user.role == 0;
	}
	create() {
		return this.user != null;
	}
	edit() {
		return this.user != null && this.record && (this._isAdmin() || this._isMember());
	}
	update() {
		return this.edit();
	}
	destroy() {
		return this.update();
	}
};
