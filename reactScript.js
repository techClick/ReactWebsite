var shipmentsPerPage = 20;
var jsonData = [];
var amountOfPages = 2;
function searchResultAmount( idToSearch ){
    var count = 0;
    if( jsonData["shipments"] ){
        for( var i=0; i < jsonData["shipments"].length ; i++){
            let thisShipmentId = jsonData["shipments"][i]["id"];
            if( idToSearch == null ){
            }else if( idToSearch != null && thisShipmentId.toUpperCase().includes(String(idToSearch).toUpperCase()) ){
            }else{
                continue;
            }
            count++;
        }
    }
    return count;
}
class PageIndicator extends React.Component {
    render(){
        return(
            <td id='tdPage'>
                <a href={'javascript:selectShipmentPage('+this.props.thisPageIndicatorId+','+
                    this.props.amountOfPages+')'}>
                    <div id ='pageDiv'>
                        {this.props.thisPageIndicatorId}
                    </div>
                </a>
            </td>
        );
    }
}
class ShowPageIndicator extends React.Component {
    constructor( props ){
        super(props);
        this.changePageToPrevious = this.changePageToPrevious.bind(this);
        this.changePageToNext = this.changePageToNext.bind(this);
        this.state={
            shippingIDToSearchFor:this.props.shippingIDToSearchFor
        }
    }
    changePageToPrevious(){
        if ( this.props.pageToShow-1<1){ return }
        this.props.changePage(this.props.pageToShow-1)
    }
    changePageToNext(){
        if ( this.props.pageToShow+1>amountOfPages){ return }
        this.props.changePage(this.props.pageToShow+1)
    }
    static getDerivedStateFromProps(props){
        return {shippingIDToSearchFor:props.shippingIDToSearchFor}
    }
    render(){
        let amountOfData = "No Data"
        if (jsonData["shipments"]){ 
            amountOfData=jsonData["shipments"].length 
        }
        let amountOfPages = Math.ceil( 
            searchResultAmount( this.state.shippingIDToSearchFor ) / shipmentsPerPage );
        let pageIndicator = [];
        for ( var i=0; i < amountOfPages ; i++ ){
            let thisPageIndicatorId = i+1;
            pageIndicator.push(<PageIndicator thisPageIndicatorId={thisPageIndicatorId}
                amountOfPages={amountOfPages}/>)
        }
        return(
            <div id="pageIndicator">
                <br/>
                Showing {searchResultAmount( this.state.shippingIDToSearchFor )} search results ( of  
                    {" "+amountOfData} )
                <br/>            
                <table id='pageTable'>
                    <tr>
                        <td id='tdPageIndicator'>
                            <div id='pageSelector'>
                                <a href='#' onClick={this.changePageToPrevious}>
                                    {"<"}
                                </a>
                            </div>            
                        </td>
                        {pageIndicator}
                        <td id='tdPageIndicator'>
                            <div id='pageSelector'>
                                <a href='#' onClick={this.changePageToNext}>
                                    {">"}
                                </a>
                            </div>            
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}
function Details2(props){
    let jsonDataTmp = props.jsonDataTmp
    let itemName = props.itemName
    return(
        <span>
            <strong>
                {itemName.toUpperCase()}: 
            </strong>
            {" "+jsonDataTmp}
        <br/>
        </span>
    )
}
function Details1(props){
    let jsonDataTmp = props.jsonDataTmp
    let itemName = props.itemName
    return(
        <span>
            <strong>{itemName.toUpperCase()}: </strong>
            {jsonDataTmp}
            <br/>
        </span>
    )
}
function ArrayOfDetails1(props){
    let jsonDataTmp = props.jsonDataTmp
    let arrayName = props.arrayName
    let details = []
    for( var arrayIndex=0; arrayIndex < jsonDataTmp.length ; arrayIndex++){
        for ( var itemName in jsonDataTmp[arrayIndex] ){
            details.push(<Details1 itemName={itemName} jsonDataTmp={jsonDataTmp[arrayIndex][itemName]} />)
        }
    }
    return(
        <div id='servicesDiv'>
            <strong>
                {arrayName}
            </strong>
            <br/>
            {details}
        </div>
    )
}
class ShipmentDetails extends React.Component{
    render(){
        let shipmentDetails = [];
        let count = 0;
        let jsonDataTmp = this.props.jsonDataTmp;
        for ( var itemName in jsonDataTmp ){
            if( count > 2 ){
                if( jsonDataTmp[itemName].constructor == Array ){
                    shipmentDetails.push(<ArrayOfDetails1 arrayName={itemName} 
                        jsonDataTmp={jsonDataTmp[itemName]} />)
                }else{
                    shipmentDetails.push(<Details2 itemName={itemName} 
                        jsonDataTmp={jsonDataTmp[itemName]} />)
                }
            }
            count++;
        }
        return(
            <div>
                {shipmentDetails}
            </div>
        )
    }
}
function DetailsButton(props){
    return(
        <div id='buttonForDetails'>
            <button id='button1' 
                onClick={()=>props.showSingleShipment(props.singleShipmentID)}>
                <span>Details</span>
            </button>
        </div>
    )
}       
function BackButton(props){
    return(
        <div id='buttonForDetails'>
            <button id='button1' onClick={props.showAllShipments}>
                <span>Back</span>
            </button>
        </div>
    )
}
class Shipments extends React.Component{
    constructor( props ){
        super(props);
        this.state = { singleShipmentID:null }
    }
    static getDerivedStateFromProps(props){
        return({singleShipmentID:props.singleShipmentID})
    }
    render(){
        let i = this.props.shipmentIndex;
        function showInputBoxForEdit( selectedShipment ){
            let searchResults = document.getElementById("button1");
            searchResults.style.display = "none";
            searchResults = document.getElementById("nameH2");
            let htmlString = "<small>Type new name</small>";
            htmlString += "<div>"+
                    "<form onSubmit='changeShipmentName("+selectedShipment+")'>"+
                        "<input type='text' name='firstname' id='newName' value='"+
                            jsonData["shipments"][selectedShipment]["name"]+"'/><br/>"+
                        "<button type='submit'>save</button>"+
                    "</form>"+
                "</div>";
            searchResults.innerHTML += htmlString;
        }
        function HeaderOnly(){
            return(
                <h2 id='nameH2'>
                    {jsonData["shipments"][i]["name"]}
                </h2>
            )
        }
        let headerType = <HeaderOnly />
        var shipmentButton;
        var shipmentDetails;
        if (this.state.singleShipmentID != null) {
            headerType = <HeaderAndEditButton />
            shipmentButton = <BackButton showAllShipments={this.props.showAllShipments}/>;
            shipmentDetails = <ShipmentDetails jsonDataTmp={jsonData["shipments"][i]}/>
        } else{
            shipmentButton = <DetailsButton 
                showSingleShipment={this.props.showSingleShipment}
                singleShipmentID={this.props.shipmentIndex}/>;
        }
        return(
            <div id='shipmentDiv'>
                <div id='shipmentSet'>
                    <div>
                        {headerType}
                    </div>
                    <div id='typeDiv'>
                        <span>
                            {jsonData["shipments"][i]["cargo"][0]["type"]}
                        </span>
                    </div>
                    <div id='descriptionDiv'>
                        <span>
                            {jsonData["shipments"][i]["cargo"][0]["description"]}
                        </span>
                        <span>
                            ({jsonData["shipments"][i]["cargo"][0]["volume"]}mCube)
                        </span>
                    </div>
                    <span>
                        <strong>
                            ID:{" "}
                        </strong>
                        {jsonData["shipments"][i]["id"]}
                    </span>
                    <br/>
                </div>
                {shipmentButton}
                {shipmentDetails}
            </div>
        )
    }
}
class ShowShipments extends React.Component{
    constructor( props ){
        super(props);
        this.state = {shippingIDToSearchFor:this.props.shippingIDToSearchFor,
            singleShipmentID:null}
        this.showSingleShipment = this.showSingleShipment.bind(this)
        this.showAllShipments = this.showAllShipments.bind(this)
    }
    static getDerivedStateFromProps(props){
       let derivedState = { shippingIDToSearchFor:props.shippingIDToSearchFor }
        if (props.saveState){
            document.getElementById("pageIndicator").style.display="inline"
            derivedState = { shippingIDToSearchFor:props.shippingIDToSearchFor , 
                singleShipmentID:props.singleShipmentID }
        }
        props.saveState=false
        return derivedState;
    }
    showSingleShipment(shipmentIndexSelected){
        document.getElementById("pageIndicator").style.display="none"
        this.setState({singleShipmentID:shipmentIndexSelected})
    }
    showAllShipments(){
        document.getElementById("pageIndicator").style.display="inline"
        this.setState({singleShipmentID:null})
    }
    render(){
        let shipmentsOnThisPage = []
        let startIndex = ( shipmentsPerPage ) * ( this.props.pageToShow - 1 );
        let shippingIDToSearchFor = this.props.shippingIDToSearchFor
        let count = 0;
        let searchDesciption = "Nothing"
        if ( jsonData["shipments"] ){
            if (this.state.singleShipmentID!=null){
                shipmentsOnThisPage.push( <Shipments shipmentIndex={this.state.singleShipmentID} 
                    showSingleShipment={this.showSingleShipment}
                    showAllShipments={this.showAllShipments}
                    singleShipmentID={this.state.singleShipmentID}/> )
                searchDesciption = null
            }else{
                for( var i=startIndex; i < jsonData["shipments"].length ; i++){
                    if( count >= shipmentsPerPage ){ break; }
                    let thisShipmentId = jsonData["shipments"][i]["id"];
                    if( shippingIDToSearchFor == "" || shippingIDToSearchFor == null ){
                    }else if( shippingIDToSearchFor != "" && shippingIDToSearchFor != null && 
                        thisShipmentId.toUpperCase().includes(String(shippingIDToSearchFor).toUpperCase()) ){
                    }else{
                        continue;
                    }
                    count++;
                    searchDesciption = null
                    shipmentsOnThisPage.push( <Shipments shipmentIndex={i} 
                        showSingleShipment={this.showSingleShipment}
                        showAllShipments={this.showAllShipments}
                        singleShipmentID={null}/> )
                }
            }
        }
        return(
            <div id='shipmentDivMain'>
                {searchDesciption}
                {shipmentsOnThisPage}
            </div>
        )
    }
}
class ShowShipmentsFromJsonFile extends React.Component {
    constructor( props ){
        super(props);
        this.state = { shippingIDToSearchFor:null}
    }
    loadJson(){
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", "db.json" , true );
        rawFile.onload = function(){
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                jsonData = JSON.parse( rawFile.responseText );
                this.props.showAllShipments("")
            }
        }.bind(this)
        rawFile.send(null);
    }
    componentDidMount(){
        if ( jsonData["shipments"] == null ){
            this.loadJson();
        }
    }
    render(){
        let pageToShow = 1;
        return(
            <ShowShipments shippingIDToSearchFor={this.state.shippingIDToSearchFor} 
                pageToShow={pageToShow} />
        );
    }
}   
class SearchBar extends React.Component {
    constructor( props ){
        super(props);
        this.searchShipmentID = this.searchShipmentID.bind(this);
    }
    searchShipmentID(e){
        e.preventDefault();
        this.props.searchShipmentID(e.target.children[1].value)
    }
    render() {
        return (
            <div id="formDiv">
                <form onSubmit=
                    {this.searchShipmentID}>
                    Search for your shipments:<br/> 
                    <input type="text" name="firstname" id="iDToSearch"/><br/><br/>
                    <button type="submit">search</button>
                </form>
            </div>
        )
    }
}
class Page extends React.Component {
    constructor( props ){
        super(props);
        this.state = {
            shippingIDToSearchFor:"",
            pageToShow:1
        };
        this.searchShipmentID = this.searchShipmentID.bind(this);
        this.changePage = this.changePage.bind(this);
    }
    searchShipmentID(shippingIDToSearchFor){
        this.setState({ shippingIDToSearchFor:shippingIDToSearchFor });
    }
    changePage(pageToShow){
        this.setState({ pageToShow:pageToShow });
    }
    render() {
        let showShipments = <ShowShipmentsFromJsonFile showAllShipments={this.searchShipmentID} />
        if ( jsonData["shipments"]){
            showShipments = <ShowShipments shippingIDToSearchFor={this.state.shippingIDToSearchFor} 
                pageToShow={this.state.pageToShow} saveState={true}/>
        }
        return (
            <div id="formDiv">
                <SearchBar searchShipmentID={this.searchShipmentID}/>
                <ShowPageIndicator changePage={this.changePage} pageToShow={this.state.pageToShow}
                    shippingIDToSearchFor={this.state.shippingIDToSearchFor} />
                {showShipments}
            </div>
        )
    }
}
ReactDOM.render(<Page />, document.getElementById('myDiv'));