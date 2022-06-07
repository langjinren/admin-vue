<template>
	<div class="page-login">
		<div class="box">
			<el-form ref="form" class="form" size="medium" :disabled="saving">
				<el-form-item label="手机号">
					<el-input
						placeholder="请输入手机号"
						v-model="form.phone"
						maxlength="11"
						auto-complete="off"
					>
						<template slot="append"
							><span :class="[form.phone.length == 11 ? 'active' : '']"
								>发送</span
							></template
						>
					</el-input>
				</el-form-item>

				<el-form-item label="验证码" class="captcha">
					<el-input
						placeholder="请输入验证码"
						maxlength="4"
						v-model="form.password"
						auto-complete="off"
						@keyup.enter.native="next"
					></el-input>
				</el-form-item>
			</el-form>

			<el-button round size="mini" class="submit-btn" @click="next" :loading="saving"
				>登录</el-button
			>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				phone: "",
				password: ""
			},
			saving: false
		};
	},

	methods: {
		async next() {
			const { phone, password } = this.form;

			if (!phone) {
				return this.$message.warning("手机号不能为空");
			}

			if (!password) {
				return this.$message.warning("验证码不能为空");
			}

			this.saving = true;

			try {
				// 登录
				// await this.$store.dispatch("userLogin", this.form);
				// // 用户信息
				// await this.$store.dispatch("userInfo");
				// // 权限菜单
				// let [first] = await this.$store.dispatch("permMenu");
				// if (!first) {
				// 	this.$message.error("该账号没有权限");
				// } else {
				// 	this.$router.push("/");
				// }
			} catch (err) {
				this.$message.error(err);
			}

			this.saving = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.page-login {
	height: 100vh;
	width: 100vw;
	position: relative;
	background-color: #2f3447;
	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 500px;
		width: 500px;
		position: absolute;
		left: calc(50% - 250px);
		top: calc(50% - 250px);
		.logo {
			height: 50px;
			margin-bottom: 20px;
		}
		/deep/.el-form {
			width: 300px;
			border-radius: 3px;
			.el-form-item {
				margin-bottom: 20px;
				&__label {
					color: #ccc;
				}
			}
			.el-input {
				.el-input__inner {
					border: 0;
					border-bottom: 0.5px solid #999;
					border-radius: 0;
					padding: 0 5px;
					background-color: transparent;
					color: #ccc;
					transition: border-color 0.3s;
					position: relative;
					&:focus {
						border-color: #fff;
						color: #fff;
					}
					&:-webkit-autofill {
						-webkit-text-fill-color: #fff !important;
						-webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
						transition: background-color 50000s ease-in-out 0s;
					}
				}
				.el-input-group__append {
					background-color: transparent;
					border-width: 0;
					border-bottom: 0.5px solid #999;
					border-radius: 0;
					padding: 0;
					cursor: pointer;
					.active {
						color: #fff;
					}
				}
			}
		}
		.submit-btn {
			margin-top: 40px;
			border-radius: 30px;
			padding: 10px 40px;
			color: #000;
		}
	}
}
</style>
