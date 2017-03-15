/**
 * Yonis Larsson (yonis.larsson.biz@gmail.com)
 * April 22th, 2016
 */
'use strict';

import React, {
	Component,
	StyleSheet,
	View,
	Text,
	Image,
	//Order,
	PanResponder,
	Animated,
	} from 'react-native';

//var Order = require('react-native-order-children');
var Utils = require('./../global/Utils');
var Resources = require('./../global/Resources');

var teamName1 = 'BAYERN';
var teamName2 = 'BORUSSIA';
var descSize = 80;
var leaguebarSize = 60;
var lineWidth = 7;


class PickingMechanismScreen extends Component {

	constructor(props) {
		super(props);

		var x = new Animated.Value(0);
		var y = new Animated.Value(0);
		var nextX = new Animated.Value(0);
		var nextY = new Animated.Value(0);
		this.state = {x, y, nextX, nextY};
	}

	_panResponder = {};

	_handlePanResponderGrant(e: Object, gestureState: Object) {
		this.state.x.setValue(0);
		this.state.y.setValue(0);
		this.state.nextX.setValue(0);
		this.state.nextY.setValue(0);
	}
	_handlePanResponderMove(e: Object, gestureState: Object) {
		var dx = Math.min(Math.max(gestureState.dx, -descSize), descSize);
		var dy = Math.min(Math.max(gestureState.dy, -descSize), descSize);
		if (Math.abs(dx) < Math.abs(dy))
			dx = 0;
		else
			dy = 0;

		this.state.x.setValue(dx);
		this.state.y.setValue(dy);

		if (dx != 0) {
			if (dx > 0)
				this.state.nextX.setValue(dx - Resources.dimension.width - descSize);
			else
				this.state.nextX.setValue(dx + Resources.dimension.width);

			this.state.nextY.setValue(0);
		} else {
			if (dy > 0)
				this.state.nextY.setValue(dy - getSoccerGroundHeight() - descSize);
			else
				this.state.nextY.setValue(dy + getSoccerGroundHeight() + descSize);

			this.state.nextX.setValue(0);
		}
	}
	_handlePanResponderRelease(e: Object, gestureState: Object) {
		var dx = this.state.x.__getValue();
		var dy = this.state.y.__getValue();

		// restore
		if (Math.abs(dx) + Math.abs(dy) < descSize) {
			Animated.parallel([
				Animated.spring(
					this.state.x,
					{toValue: 0, friction: 3}
				),
				Animated.spring(
					this.state.y,
					{toValue: 0, friction: 3}
				),
			]).start();
		// transit
		} else {
			Animated.parallel([
				Animated.timing(
					this.state.x,
					{toValue: dx / descSize * (Resources.dimension.width + (dx > 0 ? descSize : 0)), duration: 500}
				),
				Animated.timing(
					this.state.y,
					{toValue: dy / descSize * (getSoccerGroundHeight() + descSize), duration: 2000}
				),
				Animated.timing(
					this.state.nextX,
					{toValue: 0, duration: 500}
				),
				Animated.timing(
					this.state.nextY,
					{toValue: 0, duration: 2000}
				),
			]).start();
		}

	}
	componentWillMount() {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (e, gestureState) => true,
			onMoveShouldSetPanResponder: (e, gestureState) => true,
			onPanResponderGrant: (e, gestureState) => this._handlePanResponderGrant(e, gestureState),
			onPanResponderMove: (e, gestureState) => this._handlePanResponderMove(e, gestureState),
			onPanResponderRelease: (e, gestureState) => this._handlePanResponderRelease(e, gestureState),
			onPanResponderTerminate: (e, gestureState) => this._handlePanResponderRelease(e, gestureState),
		});
	}
	renderLeaguebar() {
		return (
			<View style={styles.leaguebar}>
				<Text style={styles.leaguetext}>BUNDESLIGA</Text>
			</View>
		);
	}
	renderSoccerGround(x, y, isVisible) {
		if (!isVisible) {
			return <View/>;
		} else {
			return (
				<Animated.View
					style={[styles.mainContainer, {position:'absolute'}, {transform: [{translateX:x}, {translateY:y}]}]}>
					<Image
						style={styles.mc_ground_bg}
						source={require('image!ground')}
						resizeMode={Image.resizeMode.cover}
						/>

					<View style={styles.mc_ground_home_line}>
						<Text style={styles.mc_ground_home_txt}>{teamName1}</Text>
					</View>
					<Image
						style={styles.mc_ground_uniform1}
						source={require('image!uniform1')}
						resizeMode={Image.resizeMode.contain}
						/>
					<View style={styles.mc_ground_middle_line1}/>
					<View style={styles.mc_ground_middle_line2}/>
					<View style={styles.mc_ground_middle_circle}/>
					<View style={styles.mc_ground_middle_txt_container}>
						<Text style={styles.mc_ground_middle_txt}>DRAW</Text>
					</View>
					<View style={styles.mc_ground_middle_line3}/>

					<View style={styles.mc_ground_away_line}>
						<Text style={styles.mc_ground_away_txt}>{teamName2}</Text>
					</View>
					<Image
						style={styles.mc_ground_uniform2}
						source={require('image!uniform2')}
						resizeMode={Image.resizeMode.contain}
						/>
				</Animated.View>
			);
		}
	}
	renderSoccerBall(x, y, nextX, nextY) {
		if (y.__getValue() < -getSoccerGroundHeight() / 2 || y.__getValue() > getSoccerGroundHeight() / 2) {
			return (
				<Image
					style={[styles.mc_ball, {transform: [{translateX:nextX}, {translateY:nextY}]}]}
					source={require('image!ball')}
					resizeMode={Image.resizeMode.contain}
					/>
			);
		} else {
			return (
				<Image
					style={styles.mc_ball}
					source={require('image!ball')}
					resizeMode={Image.resizeMode.contain}
					/>
			);
		}
	}
	renderMainContainer() {
		var {x, y, nextX, nextY} = this.state;

		return (
			<View style={styles.mainContainer} {...this._panResponder.panHandlers}>

				{this.renderSoccerGround(nextX, nextY, true)}
				{this.renderSoccerGround(x, y, true)}
				{this.renderSoccerBall(x, y, nextX, nextY)}

				<Animated.View style={[styles.mc_desc_home, {transform: [{translateX:x}, {translateY:y}]}]}>
					<Text style={styles.mc_desc_txt}>{teamName1} TO WIN</Text>
				</Animated.View>


				<Animated.View style={[styles.mc_desc_away, {transform: [{translateX:x}, {translateY:y}]}]}>
					<Text style={styles.mc_desc_txt}>{teamName2} TO WIN</Text>
				</Animated.View>


				<Animated.View style={[styles.mc_desc_draw, {transform: [{translateX:x}, {translateY:y}]}]}>
					<Text style={styles.mc_desc_txt}>{'D\nR\nA\nW'}</Text>
				</Animated.View>

			</View>
		);
	}
	render() {
        return (
            <View style={styles.viewContainer}>
				{Utils.renderTitlebar()}
				{this.renderLeaguebar()}

				{this.renderMainContainer()}

				{Utils.renderTabbar()}

				<View style={[{width: Resources.dimension.width, position:'absolute', left:0, top:0}]}>
					{Utils.renderTitlebar()}
					{this.renderLeaguebar()}
				</View>
            </View>
        );
    }
}

var getSoccerGroundHeight = function() {
	return Resources.dimension.height - Utils.getTitlebarHeight() - leaguebarSize - Utils.getTabbarHeight();
};

var getCircleRadius = function() {
	return Resources.dimension.width / 12;
};

var getBallSize = function() {
	return getCircleRadius();
};

var styles = StyleSheet.create({
	viewContainer:{
		backgroundColor: '#6c0',
		flexDirection: 'column',
		flex: 1
	},
	leaguebar:{
		backgroundColor: Resources.getColor('leaguebar'),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: leaguebarSize,
	},
	leaguetext:{
		textAlign: 'center',
		color: 'white',
		fontSize: Resources.getFontSize(10),
		fontWeight: '800',
		flex:1,
	},
	mainContainer:{
		width: Resources.dimension.width,
		height: getSoccerGroundHeight(),
		borderRightWidth: lineWidth,
		borderColor: 'white',
	},
	mc_ground_bg:{
		position: 'absolute',
		width: Resources.dimension.width,
		height: getSoccerGroundHeight()
	},
	mc_desc_home:{
		position: 'absolute',
		width: Resources.dimension.width,
		height: descSize,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Resources.getColor('descriptionbar'),
		left: 0,
		top: getSoccerGroundHeight(),
	},
	mc_desc_away:{
		position: 'absolute',
		width: Resources.dimension.width,
		height: descSize,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Resources.getColor('descriptionbar'),
		left: 0,
		top: -descSize,
	},
	mc_desc_draw:{
		position: 'absolute',
		width: descSize,
		height: getSoccerGroundHeight(),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Resources.getColor('descriptionbar'),
		left: -descSize,
		top: 0,
	},
	mc_desc_txt:{
		textAlign: 'center',
		color: 'black',
		fontSize: Resources.getFontSize(10),
		fontWeight: '800',
	},
	mc_ground_home_line:{
		position: 'absolute',
		borderLeftWidth: lineWidth,
		borderRightWidth: lineWidth,
		borderBottomWidth: lineWidth,
		borderColor: 'white',
		width: Resources.dimension.width * 3 / 5,
		height: getSoccerGroundHeight() / 6,
		left: Resources.dimension.width / 5,
		top: 0,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: getSoccerGroundHeight() / 20,
	},
	mc_ground_home_txt:{
		backgroundColor: 'transparent',
		textAlign: 'center',
		color: 'white',
		fontWeight: '800',
		fontSize: Resources.getFontSize(22),
	},
	mc_ground_uniform1:{
		position: 'absolute',
		width: Resources.dimension.width / 7,
		height: Resources.dimension.width / 7,
		left: Resources.dimension.width / 2 - Resources.dimension.width / 14,
		top: getSoccerGroundHeight() / 6 - Resources.dimension.width / 12,
	},
	mc_ground_uniform2:{
		position: 'absolute',
		width: Resources.dimension.width / 7,
		height: Resources.dimension.width / 7,
		left: Resources.dimension.width / 2 - Resources.dimension.width / 14,
		top: getSoccerGroundHeight() - getSoccerGroundHeight() / 6 - Resources.dimension.width / 14,
	},
	mc_ground_away_line:{
		position: 'absolute',
		borderLeftWidth: lineWidth,
		borderRightWidth: lineWidth,
		borderTopWidth: lineWidth,
		borderColor: 'white',
		width: Resources.dimension.width * 3 / 5,
		height: getSoccerGroundHeight() / 6,
		left: Resources.dimension.width / 5,
		top: getSoccerGroundHeight() - getSoccerGroundHeight() / 6,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: getSoccerGroundHeight() / 20,
	},
	mc_ground_away_txt:{
		backgroundColor: 'transparent',
		textAlign: 'center',
		color: 'white',
		fontWeight: '800',
		fontSize: Resources.getFontSize(22),
	},
	mc_ground_middle_line1:{
		position: 'absolute',
		backgroundColor: 'white',
		width: getCircleRadius() / 2,
		height: lineWidth,
		left: 0,
		top: getSoccerGroundHeight() / 2 - (lineWidth + 1) / 2,
	},
	mc_ground_middle_line2:{
		position: 'absolute',
		backgroundColor: 'white',
		width: getCircleRadius(),
		height: lineWidth,
		left: Resources.dimension.width / 2 - getCircleRadius() * 2,
		top: getSoccerGroundHeight() / 2 - (lineWidth + 1) / 2,
	},
	mc_ground_middle_line3:{
		position: 'absolute',
		backgroundColor: 'white',
		width: Resources.dimension.width / 2 - getCircleRadius(),
		height: lineWidth,
		left: Resources.dimension.width / 2 + getCircleRadius(),
		top: getSoccerGroundHeight() / 2 - (lineWidth + 1) / 2,
	},
	mc_ground_middle_circle:{
		position: 'absolute',
		backgroundColor: 'transparent',
		width: getCircleRadius() * 2,
		height: getCircleRadius() * 2,
		borderColor: 'white',
		borderWidth: lineWidth,
		borderRadius: getCircleRadius(),
		left: Resources.dimension.width / 2 - getCircleRadius(),
		top: getSoccerGroundHeight() / 2 - getCircleRadius(),
	},
	mc_ground_middle_txt_container:{
		position: 'absolute',
		backgroundColor: 'transparent',
		width: Resources.dimension.width / 2 - getCircleRadius() / 2 - getCircleRadius() * 2,
		height: getCircleRadius() * 2,
		left: getCircleRadius() / 2,
		top: getSoccerGroundHeight() / 2 - getCircleRadius(),
		justifyContent: 'center',
		alignItems:'center',
	},
	mc_ground_middle_txt:{
		textAlign: 'center',
		color: 'white',
		fontSize: Resources.getFontSize(22),
		fontWeight: '800',
	},
	mc_ball:{
		position: 'absolute',
		width: getBallSize(),
		height: getBallSize(),
		left: Resources.dimension.width / 2 - getBallSize() / 2,
		top: getSoccerGroundHeight() / 2 - getBallSize() * 3 / 7,
	},

});

module.exports = PickingMechanismScreen;