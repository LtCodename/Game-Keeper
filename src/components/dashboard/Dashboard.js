import React from 'react';
import ListBlock from '../list-block/ListBlock.js';
import './Dashboard.css'
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import AddListTool from "../add-list-tool/AddListTool";
import AddButton from "../add-button/AddButton";
import { DemoUser } from "../../App";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddListTool: false,
            userPresent: true
        };
    }

    componentDidMount() {
        if (!this.props.userData) {
            this.setState({
                userPresent: false
            })
        }
    }

    showAddListTool = () => {
        this.setState({
            showAddListTool: !this.state.showAddListTool
        });
    };

    render() {
        const listsToRender = this.props.userLists.map((elem, index) => {
            return <NavLink key={elem.id} to={"/lists/" + elem.id}><ListBlock listBlockIndex={index}/></NavLink>;
        });

        const addListButton = (
            <AddButton text={'+'} onClick={this.showAddListTool} additionalClass={'gk-add-button-dashboard'}/>
        );

        const addListNode = this.state.showAddListTool ? <AddListTool
            changeMode={this.showAddListTool}
            userLists={this.props.userLists}
            userData={this.props.userData}
            userSections={this.props.userSections}
        /> : addListButton;

        const authorized = (
            <div className="lt-col dashboard-elements">
                <div className='lists-dashboard-wrapper lt-row'>
                    {listsToRender}
                    {(this.props.userData && this.props.userData.email === DemoUser) ? '' : addListNode}
                </div>
            </div>
        );

        if (!this.state.userPresent) {
            return <Redirect to='/login' />;
        }

        return (
            <div className="contentWrapper">
                <div className="dashboardWrapper">
                    {this.props.userData ? authorized : ""}
                </div>
            </div>
        )
    }
}

const stateToProps = (state = {}) => {
    return {
        userLists: state.userLists,
        userSections: state.userSections,
        userData: state.userData
    }
};

const DashboardConnected = connect(stateToProps, null)(Dashboard);

export default DashboardConnected;
