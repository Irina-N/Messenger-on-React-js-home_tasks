import React from 'react';
import propTypes from 'prop-types'
import { TextField, Fab, CircularProgress } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import Message from './Message.jsx';
import { connect } from 'react-redux';
import { sendMessageThunk, sendMessage, fetchMessages } from '../actions/message.jsx';


class MessageField extends React.Component {
    static propTypes = {
        chatId: propTypes.string,
        chats: propTypes.object.isRequired,
        messages: propTypes.object.isRequired,
        sendMessageThunk: propTypes.func.isRequired,
        sendMessage: propTypes.func.isRequired,
        fetchMessages: propTypes.func.isRequired,
        messagesRequestStatus: propTypes.string.isRequired,
        userInfo: propTypes.object.isRequired,

    };

    state = {
        input: '',
    };

    componentDidMount() {
        if (this.props.messagesRequestStatus === '' || this.props.messagesRequestStatus === 'error') {
            this.props.fetchMessages();
        }
    }

    handleSendMessage = (message, sender) => {
        const { input } = this.state;
        const { chatId, userInfo } = this.props;

        if (input.length > 0 || sender == 'bot') {
            this.props.sendMessageThunk(message, sender, chatId);
        };
        if (sender == userInfo.userName) {
            this.setState({ input: '' });
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleKeyUp = (event) => {
        if (event.key == 'Enter') {
            this.handleSendMessage(this.state.input, this.props.userInfo.userName);
        }
    };

    render() {
        const { chatId, messages, userInfo, messagesRequestStatus } = this.props;

        if (!chatId) {
            return <div className="message_field" />
        }

        if (messagesRequestStatus === 'started') {
            return <div className="message_field">
                <CircularProgress />
            </div>
        }

        if (messagesRequestStatus === 'error') {
            return <div className="message_field">
                Can't get messages
            </div>
        }

        const messageElements = messages[chatId].map((message, index) => (
            <Message
                key={index}
                text={message.text}
                sender={message.sender}
            />)
        );

        return <div className="message_field">
            <div className="messages_board">
                {messageElements}
            </div>
            <div className="text_field">
                <TextField
                    id="outlined-basic"
                    className="typing_text"
                    name="input"
                    variant="outlined"
                    ref={this.textInput}
                    onChange={this.handleChange}
                    value={this.state.input}
                    onKeyUp={this.handleKeyUp}
                />
                <Fab
                    size='medium'
                    className="send_btn"
                    onClick={() => this.handleSendMessage(this.state.input, userInfo.userName)}>
                    <SendIcon />
                </Fab>
            </div>
        </div >;
    }
}

const mapStateToProps = state => ({
    chats: state.chatsReducer.chats,
    messages: state.messagesReducer.messages,
    messagesRequestStatus: state.messagesReducer.messagesRequestStatus,
    userInfo: state.profileReducer.userInfo,
});

const mapDispatchToProps = dispatch => {
    return {
        sendMessageThunk: (message, sender, chatId) => dispatch(sendMessageThunk(message, sender, chatId)),
        sendMessage: (message, sender, chatId) => dispatch(sendMessage(message, sender, chatId)),
        fetchMessages: () => dispatch(fetchMessages()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageField);

