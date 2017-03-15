/**
 * Yonis Larsson (yonis.larsson.biz@gmail.com)
 * April 22nd, 2016
 */

'use strict';

import React, {
    Platform,
    StyleSheet,
    Dimensions,
    } from 'react-native';

var isAndroid = Platform.OS === `android`;

var dimension = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

var colors = {
        titlebar: '#5571ff',
        leaguebar: '#474a56',
        tabbar : '#637cff',
        descriptionbar : '#e6e6e6',
    };

var strings = {
        PickingMechanism: 'PickingMechanismScreen',
    };



var getColor = function(key) {
    return colors[key];
};

var getString = function(key) {
    return strings[key];
};

var getSize = function(percentOfWidth) {
    return dimension.width * percentOfWidth / 100;
};

var getFontSize = function(size) {
    return getSize(4) + getSize(5) * size / (isAndroid ? 25 : 40);
};

var getFontSizeByScale = function(scale) {
    if (scale === 'large')
        return getFontSize(30);
    else if (scale === 'medium')
        return getFontSize(25);
    else if (scale === 'small')
        return getFontSize(20);
    else if (scale === 'tiny')
        return getFontSize(10);

    // default font size
    return getFontSize(15);
};

var getTitleFontSize = function() {
    return getFontSizeByScale('medium');
};

module.exports = {
    isAndroid: isAndroid,
    dimension: dimension,
    getColor: getColor,
    getString: getString,
    getSize: getSize,
    getFontSize: getFontSize,
    getFontSizeByScale: getFontSizeByScale,
    getTitleFontSize: getTitleFontSize,
};
