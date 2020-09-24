import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import {createStackNavigator} from "react-navigation-stack";

import Loading from "./src/screens/Loading/Loading";
import Login from "./src/screens/login/Login";
import {CitoyenAdd, ChiefEdit, CitizenEdit, CitizenSearch} from "./src/screens/citoyen/index";
import {MenageDetails, MenageAdd, MenageAddChief, MenageAddRecap, MenageSearch} from "./src/screens/menage/index";
import {AidList, AideAdd, AidHouseholdDetails} from "./src/screens/aide/index";
import {AssignAid, AssignList, AssignHouseholdDetails} from "./src/screens/assignaid/index";
import Home from "./src/screens/home/Home";
import Qrcode from "./src/screens/qrcode/Qrcode";
import Picture from "./src/screens/picture/Picture.js";

/* Login */
const LoginStack = createStackNavigator({
	Login: {
		screen: Login, 
        navigationOptions: {
            headerShown: false
        },
	},
	Home: {
		screen: Home,
		navigationOptions: {header: false}
	},
});

/* Household Creation */
const MenageStack = createStackNavigator({
	Home: {
		screen: Home,
		navigationOptions: {header: false}
	},
	MenageSearch: {
		screen: MenageSearch,
		navigationOptions: {
			headerTitle: "Recherche de ménage",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	MenageAdd: {
		screen: MenageAdd,
		navigationOptions: {
			headerTitle: "Ajout ménage",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	MenageAddChief: {
		screen: MenageAddChief,
		navigationOptions: {
			headerTitle: "Ajout ménage",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	MenageAddRecap: {
		screen: MenageAddRecap,
		navigationOptions: {
			headerTitle: "Ajout ménage",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	CitoyenAdd: {
		screen: CitoyenAdd,
		navigationOptions: ({navigation}) => {
			return{
				headerTitle: (navigation.state.params.data || {}).title || 'Ajout membre',
				headerTitleStyle: {color:'#03134F'},
				headerStyle: {backgroundColor:'orange'},
				headerTintColor: '#f26122',
				headerStyle: {height: 86}
			};
		}
	},
});

/* Citizens Stack */
const CitizenStack = createStackNavigator({
	Home: {
		screen: Home,
		navigationOptions: {header: false}
	},
	CitizenSearch: {
		screen: CitizenSearch,
		navigationOptions: {
			headerTitle: "Recherche de citoyen",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	CitizenEdit: {
		screen: CitizenEdit, 
		navigationOptions: {
			headerTitle: "Modification du citoyen",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	}
});

/* Social Aid Stack */
const SocialAidStack = createStackNavigator({
	Home: {
		screen: Home,
		navigationOptions: {header: false}
	},
	AidList: {
		screen: AidList,
		navigationOptions: {
			headerTitle: "Gestion sociale",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	AidHouseholdDetails: {
		screen: AidHouseholdDetails,
		navigationOptions: {
			headerTitle: "Gestion sociale",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
});

/* Assign Aid Stack */
const AssignAidStack = createStackNavigator({
	Home: {
		screen: Home,
		navigationOptions: {header: false}
	},
	AssignList: {
		screen: AssignList,
		navigationOptions: {
			headerTitle: "Attribution Aide Sociale",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	AssignHouseholdDetails: {
		screen: AssignHouseholdDetails,
		navigationOptions: {
			headerTitle: "Attribution Aide Sociale",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	AssignAid: {
		screen: AssignAid,
		navigationOptions: {
			headerTitle: "Attribution Aide Sociale",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
});

/* Home */
const GoHome = createStackNavigator({
	Login: {
		screen: Login, 
        navigationOptions: {
            headerShown: false
        },
	},
	Home: {
		screen: Home,
		navigationOptions: {header: false}
	}
});

/* Chief edit */
const GoChiefEdit = createStackNavigator({
	ChiefEdit: {
		screen: ChiefEdit, 
		navigationOptions: {
			headerTitle: "Modification du chef",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	}
});

/* Citizen edit */
const GoCitizenEdit = createStackNavigator({
	CitizenEdit: {
		screen: CitizenEdit, 
		navigationOptions: {
			headerTitle: "Modification du chef",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	}
});

/* QR Code */
const GoQrCode = createStackNavigator({
	Home: {
		screen: Home,
		navigationOptions: {header: false}
	},
	Qrcode: {
		screen: Qrcode,
		navigationOptions: {
			headerTitle: "Scan QR Code",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	MenageDetails: {
		screen: MenageDetails,
		navigationOptions: {
			headerTitle: "Détails ménage",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	AideAdd: {
		screen: AideAdd,
		navigationOptions: {
			headerTitle: "Attribution d'aide",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	},
	ChiefEdit: {
		screen: ChiefEdit, 
		navigationOptions: {
			headerTitle: "Modification du chef",
			headerTitleStyle: {color:'#03134F'},
			headerStyle: {backgroundColor:'orange'},
			headerTintColor: '#f26122',
			headerStyle: {height: 86}
		}
	}
});

/* Aide */
const AideStack = createStackNavigator({
	AideAdd: {
		screen: AideAdd,
		navigationOptions: ({ navigation }) => ({
			headerTitle: "Attribution d'aide",
			headerStyle: {
				height: 86
			}
		})
	},
});

/* Picture */
const PictureStack = createStackNavigator({
	Picture: {
		screen: Picture,
		navigationOptions: ({ navigation }) => ({
			headerTitle: "Prise de photo",
			headerStyle: {
				height: 86
			}
		})
	},
});

const switchNavigator = createSwitchNavigator(
	{
		Loading: Loading,
		Login: LoginStack,
		Home: GoHome,
		QRCODE: GoQrCode,
		Menage: MenageStack,
		Aide: AideStack,
		SocialAid:SocialAidStack,
		AssignAid:AssignAidStack,
		Picture: PictureStack,
		Citizen:CitizenStack
	},
	{
		initialRouteName: "Loading",
});
const AppContainer = createAppContainer(switchNavigator);

class App extends React.Component {
	render() {
		return (
			<AppContainer />
		);
	}
}

export default App;
