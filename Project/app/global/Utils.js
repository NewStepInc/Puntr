/**
 * Yonis Larsson (yonis.larsson.biz@gmail.com)
 * April 22th, 2016
 */
'use strict';

import React, {
    Component,
    View,
    Image,
    StyleSheet,
    } from 'react-native';

var Resources = require("./Resources");

var getTitlebarHeight = function() {
    return Resources.isAndroid ? 60 : 80;
};

var renderTitlebar = function () {
    return (
        <View style={styles.titlebar}>
            <Image
                style={styles.titlebar_logo}
                source={require('image!logo')}
                resizeMode={Image.resizeMode.contain}
                />
        </View>
    )
};

var getTabbarHeight = function() {
    return 80;
};

var renderTabbar = function() {
    return (
        <View style={styles.tabbar}>
        </View>
    );
};

var styles = StyleSheet.create({
    titlebar:{
        backgroundColor: Resources.getColor('titlebar'),
        paddingTop: getTitlebarHeight() - 50,
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10,
        flexDirection:'row',
        height: getTitlebarHeight(),
        alignItems: 'center',
    },
    titlebar_logo:{
        marginTop:8,
        height: 23,
        flex: 1,
    },
    tabbar:{
        backgroundColor: Resources.getColor('tabbar'),
        flexDirection:'row',
        height: 80,
        alignItems: 'center'
    },
});



module.exports = {
    renderTitlebar: renderTitlebar,
    renderTabbar: renderTabbar,
    getTitlebarHeight: getTitlebarHeight,
    getTabbarHeight: getTabbarHeight,
};
