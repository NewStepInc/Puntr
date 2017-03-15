/**
 * Yonis Larsson (yonis.larsson.biz@gmail.com)
 * April 22nd, 2016
 */

'use strict';

import React, {
    Navigator,
    Component,
    } from 'react-native';

var Utils = require('./global/Utils');
var Resources = require('./global/Resources');
var Constants = require('./global/Constants');

class MainNav extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{id: Resources.getString('PickingMechanism')}}
                renderScene={this.renderScene}
                configureScene={() => {return Navigator.SceneConfigs.PushFromRight}}
                />
        );
    }
    renderScene(route, navigator) {
        var routeId = route.id;
        //console.log(route, navigator);
        if(routeId === Resources.getString('PickingMechanism')) {
            var Screen = require("./screen/PickingMechanism");
            return (
                <Screen navigator={navigator}/>
            );
        }
    }
}

module.exports = MainNav;

