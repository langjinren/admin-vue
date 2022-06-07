export default {
	inserted: (el, bind) => {
		let SELECTWRAP = document.querySelector(
			`.el-select-dropdown.${bind.arg} .el-scrollbar .el-select-dropdown__wrap`
		);
		SELECTWRAP.addEventListener("scroll", function() {
			if (SELECTWRAP.scrollHeight - SELECTWRAP.clientHeight - SELECTWRAP.scrollTop <= 10) {
				bind.value();
			}
		});
	}
};
