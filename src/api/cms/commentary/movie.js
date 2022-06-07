import request from "@/service/request";

/**
 * 获取上线影片列表
 * @returns
 */
export const getMovieList = async ({ movie_name, page_number, page_size }) => {
	return request({
		url: `${process.env.VUE_APP_URL_MOVIE}/cms/movie`,
		method: "GET",
		params: {
			movie_name,
			page_number,
			page_size
		}
	});
};
