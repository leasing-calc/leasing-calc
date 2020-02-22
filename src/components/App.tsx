import React, {Component} from 'react';
import './App.css';

interface MyProps {
}

interface MyState {
    value: number,
    ownContributionPercentage: number,
    financingTime: number,
    redemptionAmountPercentage: number,
    interestRatePercentage: number,
    gapPercentage: number,
}

// todo - planowany harmonogram spłat?
// todo - sprawdzić czas finansowania i wysokośc gap (-1?)

class App extends Component <MyProps, MyState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            value: 80000,
            ownContributionPercentage: 20.0,
            financingTime: 36,
            redemptionAmountPercentage: 1.0,
            interestRatePercentage: 0,
            gapPercentage: 3.5
        }
    }

    render() {
        return (
            <div className="App">
                <div>
                    <label className="Title">Realny koszt leasingu</label>
                    <label className="Subtitle">Kalkulator leasingu operacyjnego nowego samochodu</label>
                </div>

                <div className="MainContainer">

                    <div className="Section">
                        <label className="SectionTitle">Wartość samochodu</label>
                        <input id="value"
                               type="number"
                               value={this.state.value}
                               onChange={this.onValueChange}/>
                        <label> zł</label>
                        {this.hasReachedLimit() &&
                        <label className="SectionText">Wartość samochodu przekracza limit {this.leasingLimit()} zł, w
                            kosztach uzyskania przychodu zostanie ujęte {this.valuePercentageInCosts().toFixed(2)}% jego
                            wartości.</label>
                        }
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Długość
                            finansowania: {this.state.financingTime} miesięcy</label>
                        <input id="financingTime"
                               type="range"
                               min="24"
                               max="72"
                               step="12"
                               value={this.state.financingTime}
                               className="Slider"
                               onChange={this.onFinancingTimeChange}/>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Wkład własny: {this.state.ownContributionPercentage}%</label>
                        <input id="ownContribution"
                               type="range"
                               min="0"
                               max="45"
                               step="5"
                               className="Slider"
                               value={this.state.ownContributionPercentage}
                               onChange={this.onOwnContributionChange}/>
                        <label className="SectionText">Kwota brutto: {this.ownContributionGross().toFixed(2)} zł</label>
                        <label className="SectionText">Koszt realny: {this.ownContributionReal().toFixed(2)} zł</label>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Wysokość
                            wykupu: {this.state.redemptionAmountPercentage}%</label>
                        <input id="redemptionAmount"
                               type="range"
                               min="1"
                               max="50"
                               step="1"
                               className="Slider"
                               value={this.state.redemptionAmountPercentage}
                               onChange={this.onRedemptionAmountChange}/>
                        <label className="SectionText">Kwota
                            brutto: {this.redemptionAmountGross().toFixed(2)} zł</label>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Oprocentowanie</label>
                        <input id="interestDate"
                               type="number"
                               value={this.state.interestRatePercentage || this.wiborBasedInterestRate().toFixed(2)}
                               onChange={this.onInterestRateChange}/>
                        <label> %</label>
                        {!this.state.interestRatePercentage &&
                        <label className="SectionTextSmall">Wartość obliczona na bazie stawki Wibor 3M
                            wynoszącej {this.wibor3m()}%.</label>}
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Ubezpieczenie GAP</label>
                        <input id="gapValue"
                               type="number"
                               value={this.state.gapPercentage}
                               onChange={this.onGapChange}/>
                        <label> %</label>
                        <label className="SectionTextSmall">Przeciętna całkowita wysokość składki ubezpieczenia GAP
                            wynosi od 2,5% do 3,5% wartości samochodu.</label>
                        <label className="SectionText">Miesięczny koszt ubepieczenia
                            gap: {this.gapMonthlyGross().toFixed(2)} zł</label>
                    </div>

                    <div className="Section">
                        <label className="SectionTitle">Rata leasingu
                            brutto: {this.installmentGross().toFixed(2)} zł</label>
                        <label className="SectionTitle">Realna rata
                            leasingu: {this.installmentReal().toFixed(2)} zł</label>
                    </div>
                </div>
            </div>
        )
    }

    onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({value: Number(event.target.value)});
    };

    onOwnContributionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ownContributionPercentage: Number(event.target.value)});
    };

    onFinancingTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({financingTime: Number(event.target.value)});
    };

    onRedemptionAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({redemptionAmountPercentage: Number(event.target.value)});
    };

    onInterestRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({interestRatePercentage: Number(event.target.value)});
    };

    onGapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({gapPercentage: Number(event.target.value)});
    };

    hasReachedLimit = () => this.state.value > this.leasingLimit();

    valuePercentageInCosts = () => this.hasReachedLimit() ? this.leasingLimit() * 100 / this.state.value : 100;

    ownContributionGross = () => this.state.value / 100 * this.state.ownContributionPercentage;

    ownContributionReal = () => this.calcRealCost(this.ownContributionGross());

    redemptionAmountGross = () => this.state.value / 100 * this.state.redemptionAmountPercentage;

    wiborBasedInterestRate = () => this.wibor3m() * this.state.financingTime / 12;

    financingTimeWithoutRedemption = () => this.state.financingTime - 1; // ostatnia rata to wykup

    gapMonthlyGross = () => this.state.value / 100 * this.state.gapPercentage / this.financingTimeWithoutRedemption();

    installmentGross = () => {
        let interestRate = this.state.interestRatePercentage || this.wiborBasedInterestRate();
        let totalCost = this.state.value * (100 + interestRate) / 100;
        return (totalCost - this.ownContributionGross() - this.redemptionAmountGross()) / this.financingTimeWithoutRedemption() + this.gapMonthlyGross();
    };

    installmentReal = () => this.calcRealCost(this.installmentGross());

    wibor3m = () => 1.71;

    leasingLimit = () => 165470.85; // todo - użytek mieszany, wyłączny i bez vat

    taxValue = () => 0.19; // todo - podatek progresywny, liniowy, ipbox, inne?

    calcRealCost = (value: number) => {
        let valueInCosts = value * this.valuePercentageInCosts() / 100;
        console.log(valueInCosts);
        return (value - (valueInCosts - (valueInCosts / 1.23)) / 2) * (1 - this.taxValue());
    }

}

export default App;
