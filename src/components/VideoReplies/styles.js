import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
    container: {
      flex: 1,
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden'
    },
    dragHandler: {
      height: 65,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white,
      flexDirection: 'row',
      zIndex: 9,
      width: '100%'
    },
    iconWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50
      },
      iconSkipFont: {
        height: 16,
        width: 16
      },
      repliesTxt: {
        flex: 4,
        alignItems: 'center',
        marginRight:50          //equal to crossIcon width in order to maintain text in center
      },
      headerStyles: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerText:{
        fontFamily: 'AvenirNext-Medium',
        color: Colors.valhalla,
        fontSize: 18
      },
      headerSubText:{
        fontSize: 12,
        color: 'rgba(42, 41, 59, 0.7)'
      },
      addReplyView : {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        width:'100%',
        height:54,
        shadowColor:'#000',
        elevation: 8,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,shadowRadius: 1,
        position:'absolute',
        bottom:0,
        zIndex:9999,
        backgroundColor:Colors.white,
        paddingVertical:18,
        paddingHorizontal:12
    },
    addReplyText : {
        color:Colors.black,
        marginLeft:10
    },
    addReplyImageDimension : {
        height:10,
        width:15
    }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);