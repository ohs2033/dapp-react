import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: 'do you want to enter?'
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Wating on transaction success...'})
    
    try {
      /*
      this code will take some time...about 15~30 seconds.
       */
      await lottery.methods.enter().send({ 
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });  
    } catch (err) {
      window.alert(err);
      this.setState({
        message: 'fail!'
      })
      return;
    }
    this.setState({
      message: 'You have been entered!'
    })
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({
      message: 'Wating on transaction success....'
    });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has benn picked!'})
  }; 

  async componentDidMount() {
    const manager = await lottery.methods.manager().call(
      /* from: accounts[0] */);
    const players = await lottery.methods.getPlayers.call();;
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager , players, balance});
  }



  render() {
    console.log(web3.version);
    web3.eth.getAccounts().then(console.log)
    return (
      <div className="App">
        <h2> Lottery Contract</h2>
        <p> This contract is managed by {this.state.manager}
          There are currently {this.state.players.length} people.
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr />

        <form>
          <h4>Want to try your luck?</h4>
          <div>
          <input 
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
          />
          <button
            onClick={this.onSubmit}
          > Enter </button>

          </div>
        </form>
        <hr />
        <h1>{this.state.message}</h1>

        <hr />
        <h4> Ready to pick a winner</h4>
        <button onClick={this.onClick}> Pick a winner!</button>


      </div>
    );
  }
}

export default App;
