<template>
	<view>
		<u-navbar v-if="$slots.left && $slots.center" :titleStyle="titleStyle" :leftIconColor="leftIconColor" :title="title" :autoBack="autoBack" :fixed="fixed" :placeholder="placeholder" :bgColor="bgColor">
			<template v-slot:left>
				<slot name="left"></slot>
			</template>
			<template v-slot:center>
				<slot name="center"></slot>
			</template>
		</u-navbar>
		<u-navbar v-else-if="$slots.left" :titleStyle="titleStyle" :leftIconColor="leftIconColor" :title="title" :autoBack="autoBack" :fixed="fixed" :placeholder="placeholder" :bgColor="bgColor">
			<template v-slot:left>
				<slot name="left"></slot>
			</template>
		</u-navbar>
		<u-navbar v-else-if="$slots.center" :titleStyle="titleStyle" :leftIconColor="leftIconColor" :title="title" :autoBack="autoBack" :fixed="fixed" :placeholder="placeholder" :bgColor="bgColor">
			<template v-slot:center>
				<slot name="center"></slot>
			</template>
		</u-navbar>
		<u-navbar v-else :titleStyle="titleStyle" :leftIconColor="leftIconColor" :title="title" :autoBack="autoBack" :fixed="fixed" :placeholder="placeholder" :bgColor="bgColor"></u-navbar>
	</view>
</template>

<script>
export default {
	name: 'Navbar',
	props: {
		title: {
			type: String,
			default: ''
		},
		autoBack: {
			type: Boolean,
			default: true
		},
		bgColor: {
			type: String,
			default: '#FFF'
		},
		leftIconColor: {
			type: String,
			default: '#333'
		},
		fixed: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: Boolean,
			default: true
		},
		titleStyle : {
			type: String,
		}
	},
	mounted() {
		
	},
	data() {
		return {}
	}
}
</script>

<style></style>
