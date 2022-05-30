import { BaseService, Service, Permission } from "cl-admin";

@Service("")
class SysLog extends BaseService {
	@Permission("")
	clear() {
		return this.request({
			url: "/clear",
			method: "POST"
		});
	}

	@Permission("")
	getKeep() {
		return this.request({
			url: "/getKeep"
		});
	}

	@Permission("")
	setKeep(value) {
		return this.request({
			url: "/setKeep",
			method: "POST",
			data: {
				value
			}
		});
	}
}

export default SysLog;
