import React, {ChangeEventHandler, Component} from 'react';
import './App.css';

interface MyProps {
}

interface MyState {
    value: number,
    ownContribution: number,
    financingTime: number,
    redemptionAmount: number,
}

class App extends Component <MyProps, MyState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            value: 80000,
            ownContribution: 20,
            financingTime: 36,
            redemptionAmount: 1,
        }
    }

    render() {
        return (
            <div className="App">
                <div>
                    <label className="Title">Leasing operacyjny nowego samochodu</label>
                    <label className="Subtitle">Realny koszt leasingu</label>
                </div>

                <div className="MainContainer">

                    <div className="Section">
                        <label className="SectionTitle">Wartość samochodu</label>
                        <input id="value"
                               type="number"
                               value={this.state.value}
                               onChange={this.valueChange}/>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Długość finansowania: {this.state.financingTime} miesięcy</label>
                        <input id="financingTime"
                               type="range"
                               min="24"
                               max="72"
                               step="12"
                               value={this.state.financingTime}
                               className="Slider"
                               onChange={this.financingTimeChange}/>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Wkład własny: {this.state.ownContribution}%</label>
                        <input id="ownContribution"
                               type="range"
                               min="0"
                               max="45"
                               step="5"
                               className="Slider"
                               value={this.state.ownContribution}
                               onChange={this.ownContributionChange}/>
                        <label className="SectionSubtitle">Kwota brutto: {this.ownContributionGross()} zł</label>
                        <label className="SectionSubtitle">Koszt realny: TODO</label>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Wysokość wykupu: {this.state.redemptionAmount}%</label>
                        <input id="redemptionAmount"
                               type="range"
                               min="1"
                               max="50"
                               step="1"
                               value={this.state.redemptionAmount}
                               className="Slider" onChange={this.redemptionAmountChange}/>
                        <label className="SectionSubtitle">Kwota brutto: {this.redemptionAmountGross()} zł</label>
                        <label className="SectionSubtitle">Koszt realny: TODO</label>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Oprocentowanie</label>
                        <input type="text" value="tbd - wibor + długość finansowania" id="interestDate"/>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">GAP RTI</label>
                        <input type="text" value="3%" id="gapValue"/>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Wysokość raty</label>
                        <label className="SectionSubtitle">Rata brutto: TODO</label>
                        <label className="SectionSubtitle">Realny koszt raty: TODO</label>
                    </div>
                </div>
            </div>
        )
    }

    valueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({value: Number(event.target.value)});
    };

    ownContributionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ownContribution: Number(event.target.value)});
    };

    financingTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({financingTime: Number(event.target.value)});
    };

    redemptionAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({redemptionAmount: Number(event.target.value)});
    };

    ownContributionGross = () => this.state.value / 100 * this.state.ownContribution;

    redemptionAmountGross = () => this.state.value / 100 * this.state.redemptionAmount;

}

export default App;
