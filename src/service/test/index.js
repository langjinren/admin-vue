import { BaseService, Service, Permission } from "cl-admin";

@Service("")
class Test extends BaseService {
	@Permission("")
	getKeep(params) {
		return this.request({
			url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/get_movie_commentary_list`,
			method: "GET",
			params
		});
	}

	@Permission("")
	list(params) {
    return this.request({
			url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/get_movie_commentary_list`,
			method: "GET",
			params
    });
	}
	
	@Permission("")
	info(params) {
    return this.request({
			url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/get_movie_commentary_list`,
			method: "GET",
			params
    });
	}
}

export default Test;
