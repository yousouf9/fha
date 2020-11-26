import React, { PureComponent } from 'react';
import {Container} from  'react-bootstrap';
import {Link} from 'react-router-dom'
import {connect} from  'react-redux';
import {bindActionCreators} from  'redux';
import {getAllEstate , clearEstate } from '../../../Actions'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCube, faPlus} from '@fortawesome/free-solid-svg-icons'
import styles from '../../../widgets/Forms/index.module.css'
import EstateList from '../../../widgets/estates/estateList';


let counter = 0;  


class ViewEstate extends PureComponent {
   
     constructor(props){
        super(props)
     
        }

       

    componentWillUnmount(){
        this.props.clearEstate();
    }


    componentDidMount(){
     //Set the start, limit, and order here initial of 0, 100 and ASC is set at the action
    this.props.getAllEstate(0, 6, 'desc');

   
    }

    loadmoreEtate =()=>{
        
        const count =  this.props.estates.getAllEstate.result.length;

        counter  =  counter + count;
        this.props.getAllEstate(count, 6, "desc");
 
    }
    
    loadLastEtate =()=>{

        console.log(counter-6);
        this.props.getAllEstate(counter-6, 6, "desc");
 
    }

    render() {
       
        return (
            <Container className="p-3 text-center text-mutted">
                 <p className="pt-3"><FontAwesomeIcon icon={faCube} size="lg"/>View All Estates</p>
                 <div className={`animate__animated animate__fadeInUp shadow-sm p-3 mb-5 bg-white rounded ${styles.formContainer}`}>
                   <EstateList  {...this.props} />
                   

                    <div class="d-flex bd-highlight mb-3">
                        <div class="p-2 bd-highlight">
                        <Link to="/admin/add/estate" className="btn btn-md btn-success">
                                <FontAwesomeIcon icon={faPlus} size="lg" /> Create New Estate
                         </Link>
                        </div>
                        <div class="ml-auto p-2 bd-highlight">
                            <button className="btn btn-md btn-success px-3 mr-2" onClick={this.loadLastEtate}>Prev </button>
                            <button className="btn btn-md btn-success px-3" onClick={this.loadmoreEtate}>Next </button>
                        </div>
                    </div>
                  
                
                  </div>

            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    //console.log("from state", state);
    return {
        estates: state.estates,
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
       getAllEstate,
       clearEstate
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewEstate);