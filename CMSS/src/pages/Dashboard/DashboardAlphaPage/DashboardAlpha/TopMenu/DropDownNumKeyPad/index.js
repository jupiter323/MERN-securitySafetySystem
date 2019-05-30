import React from 'react'
import { message } from 'antd'
import { connect } from 'react-redux'
import './style.scss'
import $ from 'jquery'
import num0Image from 'assets/img/numkeypad/0 Button.svg'
import num1Image from 'assets/img/numkeypad/1 Button.svg'
import num2Image from 'assets/img/numkeypad/2 Button.svg'
import num3Image from 'assets/img/numkeypad/3 Button.svg'
import num4Image from 'assets/img/numkeypad/4 Button.svg'
import num5Image from 'assets/img/numkeypad/5 Button.svg'
import num6Image from 'assets/img/numkeypad/6 Button.svg'
import num7Image from 'assets/img/numkeypad/7 Button.svg'
import num8Image from 'assets/img/numkeypad/8 Button.svg'
import num9Image from 'assets/img/numkeypad/9 Button.svg'
import backImage from 'assets/img/numkeypad/Back Button.svg'
import enterImage from 'assets/img/numkeypad/Enter Button.svg'

let scroll_flag = true
let update_flag = true
let eventRow_count = 50
const mapStateToProps = (state, props) => ({
    numberkey: state.numberkey
})

const mapDispatchToProps = (dispatch, props) => ({
    dispatch: dispatch,
})


@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class DropDownNumKeyPad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardInputValue: '',
            // numberkeypassed: localStorage.numberkeypassed        ,
            alarmMessages: []
        }
    }
    async componentDidMount() {
        await this.setState({
            alarmMessages: [{ msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }, { msg: "first", DeviceName: "any device", DateTime: null }]
        })
        this.initTable()
    }
    componentWillUnmount() {
        $('#messageContainer')
            .find('.tableArea')
            .empty()
        $('#messageContainer').scrollTop(0)
        $('#messageContainer').find('.tableArea')
    }

    handleKeyboardInput = async (key) => {
        let { keyboardInputValue } = this.state

        switch (key) {
            case "-1":
                this.setState({ keyboardInputValue: keyboardInputValue.substring(0, keyboardInputValue.length - 1) });
                this.clearNumberKeyPassed()

                break;
            case "-2":
                message.info("completed number input as " + this.state.keyboardInputValue);
                this.setNumberKeyPassed()
                break;
            default:
                if (this.state.keyboardInputValue.length !== 6)
                    this.setState({ keyboardInputValue: keyboardInputValue + key });
                break;
        }
    }
    setNumberKeyPassed = () => {
        var { onKeypadValidateUser } = this.props
        // this.setState({ numberkeypassed: 1 })
        onKeypadValidateUser(this.state.keyboardInputValue);
        this.setState({ keyboardInputValue: '' })
    }
    clearNumberKeyPassed = () => {
        // localStorage.removeItem("numberkeypassed");
        // this.setState({ numberkeypassed: undefined })
    }

    buttonModearrayToJson = (buttonsmode) => {
        var buttonmodeJson = {}
        buttonsmode.map(e => buttonmodeJson[e.key] = e.value === "Active" ? true : false);
        return buttonmodeJson;
    }
    handleControlButton = (key) => {
        let { numberkey, onActivateButton, onAcknowledgeAlarmActive } = this.props
        var { numberkeypassed, buttonsmode, code } = numberkey
        if (!numberkeypassed) return; // unloacked
        if (key === 'acknowledge') return onAcknowledgeAlarmActive(code) //acknowledge alarms

        var buttonmodeJson = this.buttonModearrayToJson(buttonsmode)
        let buttonMode = buttonsmode.filter(e => e['key'] === key)[0]
        let labelTxt = buttonMode ? buttonMode['text'] : null
        onActivateButton(code, labelTxt)

    }
    handleScroll = e => {
        var node = e.target
        if (node.scrollTop === 0) {
            scroll_flag = !scroll_flag
        } else {
            if (scroll_flag) {
                scroll_flag = !scroll_flag
            }
        }

        const bottom = node.scrollHeight - node.scrollTop - node.clientHeight
        if (bottom < 100) {
            update_flag = !update_flag
            let renderAlarmMessages = []
            let { alarmMessages } = this.state
            let eventArray = alarmMessages
            let cur_eventArray = []
            let count = 0
            if (typeof eventArray !== 'undefined' && eventArray.length > 0) {
                count = eventRow_count + 50 > eventArray.length ? eventArray.length : eventRow_count + 50
                cur_eventArray = eventArray.slice(eventRow_count, count)
                if (eventRow_count >= count) {
                    console.log("load all event data")
                    return;
                }
                eventRow_count = count > 0 ? count : eventRow_count
            }
            cur_eventArray.forEach(event => {
                let row = {}
                row.datetime = new Date(event.DateTime)
                    .toLocaleString('en-GB', { timeZone: 'UTC' })
                    .replace(',', '')
                row.device = event.DeviceName.toUpperCase()
                row.msg = event.msg.toUpperCase()
                renderAlarmMessages.push(row)
            })
            this.renderTable(renderAlarmMessages)
        }
    }

    initTable = () => {
        let { alarmMessages } = this.state

        let limit_count = 50
        let count = limit_count > alarmMessages.length ? alarmMessages.length : limit_count
        let start = 0
        let cur_alarmMessages = alarmMessages.slice(start, count)
        let renderAlarmMessages = []
        cur_alarmMessages.forEach(event => {
            let row = {}
            row.datetime = new Date(event.DateTime)
                .toLocaleString('en-GB', { timeZone: 'UTC' })
                .replace(',', '')
            row.device = event.DeviceName.toUpperCase()
            row.msg = event.msg.toUpperCase()
            renderAlarmMessages.push(row)
        })
        this.renderTable(renderAlarmMessages)
        if ($('#messageContainer')) {
            $('#messageContainer')
                .find('.tableArea')
                .css('display', 'block')
        }
    }

    renderTable = alarmMessages => {
        alarmMessages.forEach(log => {
            let className = 'row eventRow'

            let new_row = $(
                `<div class="${className}">             
                    <div class="col-6 eventItem">
                        ${log.device}
                    </div>
                    <div class="col-6 eventItem">
                        ${log.msg}                
                    </div>
                </div>`,
            )
            $('#messageContainer')
                .find('.tableArea')
                .append(new_row)
        })
    }
    render() {
        let { numberkey } = this.props
        var { numberkeypassed, buttonsmode, acknowledgedAlarm } = numberkey
        let { keyboardInputValue } = this.state
        var buttonmodeJson = this.buttonModearrayToJson(buttonsmode)
        console.log("number key passed: ", numberkeypassed, buttonsmode, buttonmodeJson)     
        return (
            <ul className="dropdown numkeypad p-1">
                <div className="row w-100 m-0 top-row-num">
                    <div className="col p-0 h-100">
                        <div className="row m-0 top-row-digit">
                            <div className="sub-content w-100 m-2">
                                <label className="title">
                                    {
                                        keyboardInputValue.split("").map((e, i) => i > 5 ? "" : "*")
                                    }
                                </label>
                            </div>
                        </div>
                        <div className="row m-0 top-row-message h-75 p-2">
                            <div className="sub-content w-100 h-100">
                                <div className="AlarmMessageView">
                                    <div className={'messageTitle'}>MESSAGES</div>
                                    <div id={'messageContainer'} onScroll={this.handleScroll}>
                                        <div
                                            className={'tableArea'}
                                            onMouseDown={this.handleMouseDown}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col p-0 h-100">
                        <div className="row m-0 w-100 p-0">
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("1") }}>
                                <img
                                    className="m-0"
                                    src={num1Image}
                                    alt="1"
                                />
                            </div>
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("2") }}>
                                <img
                                    className="m-0"
                                    src={num2Image}
                                    alt="2"
                                />
                            </div>
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("3") }}>
                                <img
                                    className="m-0"
                                    src={num3Image}
                                    alt="3"
                                />
                            </div>
                        </div>
                        <div className="row m-0 w-100 p-0">
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("4") }}>
                                <img
                                    className="m-0"
                                    src={num4Image}
                                    alt="4"
                                />
                            </div>
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("5") }}>
                                <img
                                    className="m-0"
                                    src={num5Image}
                                    alt="5"
                                />
                            </div>
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("6") }}>
                                <img
                                    className="m-0"
                                    src={num6Image}
                                    alt="6"
                                />
                            </div>
                        </div>
                        <div className="row m-0 w-100 p-0">
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("7") }}>
                                <img
                                    className="m-0"
                                    src={num7Image}
                                    alt="7"
                                />
                            </div>
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("8") }}>
                                <img
                                    className="m-0"
                                    src={num8Image}
                                    alt="8"
                                />
                            </div>
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("9") }}>
                                <img
                                    className="m-0"
                                    src={num9Image}
                                    alt="9"
                                />
                            </div>
                        </div>
                        <div className="row m-0 w-100 p-0">
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("0") }}>
                                <img
                                    className="m-0"
                                    src={num0Image}
                                    alt="0"
                                />
                            </div>
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("-1") }}>
                                <img
                                    className="m-0"
                                    src={backImage}
                                    alt="back"
                                />
                            </div>
                            <div className="col-4 m-0 p-0 h-100" onClick={() => { this.handleKeyboardInput("-2") }}>
                                <img
                                    className="m-0"
                                    src={enterImage}
                                    alt="enter"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row w-100 m-0">
                    <div className="col p-0 m-0 h-100" onClick={() => this.handleControlButton("owner")}>
                  
                        <ControlButton numberkeypassed={numberkeypassed} state={buttonmodeJson['owner']} btnTxt={["OWNER'S", "CITADEL", "MODE"]} />
                    </div>
                    <div className="col p-0 m-0 h-100" onClick={() => this.handleControlButton("general")} >
                   
                        <ControlButton numberkeypassed={numberkeypassed} state={buttonmodeJson['general']} btnTxt={["GENERAL", "CITADEL", "MODE"]} />
                    </div>
                    <div className="col p-0 m-0 h-100" onClick={() => this.handleControlButton("normal")}>
                  
                        <ControlButton numberkeypassed={numberkeypassed} state={buttonmodeJson['normal']} btnTxt={["NORMAL", "OPERATING", "MODE"]} />

                    </div>
                    <div className="col p-0 m-0 h-100" onClick={() => this.handleControlButton("emergency")}>
                      
                        <ControlButton numberkeypassed={numberkeypassed} state={buttonmodeJson['emergency']} btnTxt={["EMERGENCY", "DACS LOCKS", "OVERRIDE"]} />

                    </div>
                    <div className="col p-0 m-0 h-100" onClick={() => this.handleControlButton("acknowledge")}>
                      
                        <AcknowledgeAlarm numberkeypassed={numberkeypassed} state={acknowledgedAlarm} btnTxt={["ACKNOWLEDGE", "ALARM"]} />

                    </div>
                </div>
            </ul>
        )
    }

}

function ControlButton(props) {
    var { state, numberkeypassed, btnTxt } = props
    var classname = (numberkeypassed ? state ? 'ulocked-active' : 'ulocked-inactive' : state ? 'locked-active' : 'locked-inactive') + " -button"
    return (
        <div className={classname} >
            <div className="wrap-text">
                <p className="p-0 m-0">
                    {btnTxt[0]}
                </p >
                <p className="p-0 m-0">
                    {btnTxt[1]}
                </p>
                <p className="p-0 m-0">
                    {btnTxt[2]}
                </p>
            </div>
        </div >
    )
}
function AcknowledgeAlarm(props) {
    var { state, numberkeypassed, btnTxt } = props
    var classname = (numberkeypassed ? state ? 'ack-ulocked-active' : 'ack-ulocked-inactive' : state ? 'ack-locked-active' : 'ack-locked-inactive') + " ack-button"
    return (
        <div className={classname} >
            <div className="wrap-text">
                <p className="p-0 m-0">
                    {btnTxt[0]}
                </p >
                <p className="p-0 m-0">
                    {btnTxt[1]}
                </p>
            </div>
        </div >
    )
}


