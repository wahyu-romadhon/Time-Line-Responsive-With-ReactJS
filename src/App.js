import React from 'react';
import moment from 'moment'
import cron from 'node-cron'

class App extends React.Component {
    state = {
        timeList: [
            moment().format('12:00'),
            moment().format('13:00'),
            moment().format('14:00'),
            moment().format('15:00'),
            moment().format('16:00'),
        ],
        timeNow: moment().format('HH:mm'),
        widthPerPixel: 0,
        marginLeft : 0
    }

    componentDidMount() {
        this.getUpdateRefreshTime()
        this.getWidthTable()
        window.addEventListener('resize', this.getWidthTable)
    }

    componentWillUnmount() {
        this.autoRefreshTime.destroy()
        window.removeEventListener('resize', this.getWidthTable)
    }

    getUpdateRefreshTime = () => {
        this.autoRefreshTime = cron.schedule('*/1 * * * *', () => this.getUpdateWidthTable())
    }

    getWidthTable = async () => {
        const elementTbody = document.getElementById('bodyTable')
        await this.setState({
            widthPerPixel: elementTbody.clientWidth
        })
        this.getWidthLeftMargin()
    }

    getUpdateWidthTable = () =>{
        this.setState({
            timeNow: moment().format('HH:mm'),
        })
        this.getWidthLeftMargin()
    }

    getWidthLeftMargin = () => {
        const { timeNow, timeList, widthPerPixel } = this.state
        const marginLeftNow = -20
        const oneHour = 60

        let widthPixel = widthPerPixel / timeList.length / oneHour

        let timeNowMinute = moment.duration(timeNow).minutes();
        let timeNowHour = moment.duration(timeNow).hours();
        let convertTimeNow = timeNowMinute + (timeNowHour * oneHour)

        let firstTimeMinute = moment.duration(timeList[0]).minutes();
        let firstTimeHour = moment.duration(timeList[0]).hours();
        let convertFirstTime = firstTimeMinute + (firstTimeHour * oneHour)

        let diffrentTime = convertTimeNow - convertFirstTime
        let TotalMargin = marginLeftNow + (widthPixel * diffrentTime)
        this.setState({
            marginLeft : TotalMargin

        })

    }

    render() {
        const { timeList, timeNow } = this.state
        return (
            <div style={{ margin: '20px', background: 'silver', padding: '10px' }}>
                <div>
                    <table border="1" style={{ width: '100%' }} id="bodyTable">
                        <tr>
                            {
                                timeList.map(w => <th>{w}</th>)
                            }
                        </tr>
                    </table>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: this.state.marginLeft,
                    marginTop: '10px'
                }}>
                    <div style={{
                        border: '1px solid orange',
                        background: 'orange',
                        fontSize: '12px',
                        width: '50px',
                        borderRadius: '50px',
                        padding: '0px 8px',
                        color: 'white'
                    }}>
                        {timeNow}
                    </div>
                    <div style={{
                        borderLeft: '2px solid orange',
                        height: '50vh',
                        width: '100%',
                        margin: '0px 24px'
                    }}>
                    </div>
                </div>
            </div>
        );
    }

}

export default App;