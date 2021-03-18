import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import DoenetViewer from './DoenetViewer';
import "./editor.css";
import allComponents from '../../docs/complete-docs.json';
import ErrorBoundary from './ErrorBoundary';
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";



class DoenetGuestEditor extends Component {
  constructor(props) {
    super(props);
    this.documentProps = Object.keys(allComponents.document.properties);

    this.saveTimer = null;

    this.contextPanel = <div id="contextPanel"><p>loading...</p></div>
    this.doenetML = "";
    let url_string = window.location.href;
    var url = new URL(url_string);
    this.contentId = url.searchParams.get("contentId");
    this.branchId = url.searchParams.get("branchId");
    this.updateNumber = 0;

    var errorMsg = null;
    var loading = true;

    if (this.contentId !== null) {

      //Load most recent content from the branch or
      //Load specific branch's content id if it is given      

      const phpUrl = '/open_api/getDoenetML.php';
      const data = {
        branchId: this.branchId,
        contentId: this.contentId,
      }
      const payload = {
        params: data
      }

      axios.get(phpUrl, payload)
        .then(resp => {
          
          console.log("data",resp.data)

          if (resp.data.access === false) {
            this.setState({ loading: false, accessAllowed: false });
          } else {
            this.updateNumber++;
            let doenetML = resp.data.doenetML;
            let title = resp.data.title;
            if (!doenetML) { doenetML = ""; }
            if (!title) { title = ""; }

            this.setState({
              documentTitle: title,
              loading: false,
              editorDoenetML: doenetML,
              viewerDoenetML: doenetML,
            });
          }

        })
        .catch((error) => {
          this.setState({ error: error })
        })
    }

    this.state = {
      editorDoenetML: "",
      viewerDoenetML: "",
      fontSize: 12,
      documentTitle: "",
      errorMsg: errorMsg,
      loading: loading,
      accessAllowed: true,
    }

    this.editorDOM = null;
    this.monacoDOM = null;

    this.viewerWindow = null;
  }



  calculate_documentTitle({ doenetML, currentTitle }) {
    let newTitle = currentTitle;
    let searchDoenetML = doenetML;
    let expectedDocTitleTags = [...this.documentProps, "document"];
    let cursor = 0;

    let result = findNextTag({ code: searchDoenetML, index: cursor });

    if (!expectedDocTitleTags.includes(result.tagType)) {
      return newTitle;
    }
    if (result.tagType === "title") {
      let endTagIndex = doenetML.indexOf("</title>");
      let newTitle = doenetML.substring(Number(result.tagIndex) + Number(result.tagString.length), endTagIndex);
      return newTitle;
    }
    if (result.tagType === "document") {
      cursor = cursor + Number(result.tagIndex) + Number(result.tagString.length);
      searchDoenetML = searchDoenetML.substring(cursor, searchDoenetML.length);
    }

    expectedDocTitleTags.pop(); //remove document


    result = findNextTag({ code: searchDoenetML, index: cursor });
    if (!expectedDocTitleTags.includes(result.tagType)) {
      return newTitle;
    }
    if (result.tagType === "title") {
      let endTagIndex = searchDoenetML.indexOf("</title>");
      let newTitle = searchDoenetML.substring(Number(result.tagIndex) + Number(result.tagString.length), endTagIndex);
      return newTitle;
    }

    return newTitle;
  }

  // updateLocationBar(assignmentId=this.assignmentId, activeSection=this.activeSection){
  //   history.replaceState({},"title","?active="+activeSection);
  //   if (this.activeSection === "assignments") {
  //     console.log(this.assignmentId);
  //     history.replaceState({},"title","?active="+activeSection+"&assignmentId="+assignmentId);
  //   }
  // }


  // getContentId ({doenetML}){
  //   const hash = crypto.createHash('sha256');
  //   if (doenetML === undefined){
  //     return;
  //   }

  //   hash.update(doenetML);
  //   let contentId = hash.digest('hex');
  //   return contentId;
  // }


  handleViewerUpdate = () => {
    this.updateNumber++;
    this.setState({ viewerDoenetML: this.state.editorDoenetML });
  }

  // updateEditor(editorDoenetML, e){
  //   console.log('updateEditor',editorDoenetML);
  //   console.log('state viewerDoenetML',this.state.viewerDoenetML);

  //   if (editorDoenetML !== this.state.editorDoenetML){
  //   // this.editorDOM.setValue(editorDoenetML)
  //   // this.setState({editorDoenetML})
  //   this.setState({viewerDoenetML:editorDoenetML})
  //   }
  // }

  // editorDidMount(editor, monaco){
  //   this.editorDOM = editor;
  //   this.monacoDOM = monaco;
  //   // this.updateEditor();
  //   this.editorDOM.focus();
  // }


  editorDidMount = (editor, monaco) => {
    // eslint-disable-next-line no-console
    // console.log("editorDidMount", editor, editor.getValue(), editor.getModel());
    this.editorDOM = editor;
    this.monacoDOM = monaco;
    // console.log("editorDOM",editor)
    this.model = this.editorDOM.getModel();
    // console.log(model._tokenization)
    // console.log('tokens')
    // console.log(model.getLineContent(2));
    // console.log(model._tokens)
    // let tokens = this.editorDOM.tokenize(editor.getValue(),'xml')
    // console.log(tokens)

    // this.editorDOM.onDidChangeCursorSelection(e =>{
    //   this.onSelectionsChange(e.selection, ...e.secondarySelections)
    // })
  };
  // onSelectionsChange = (selection,secondarySelections) => {
  //   if (secondarySelections){
  //     console.log('secondary!')
  //     return;
  //   }
  //   console.log('selection',selection)
  //   // let model = this.editorDOM.getModel();
  //   console.log('model',this.model)
  //   // console.log(model._tokenization)

  // }
  onChange = (editorDoenetML) => {
    let title = this.calculate_documentTitle({ doenetML: editorDoenetML, currentTitle: this.state.documentTitle });
    this.setState({ editorDoenetML, documentTitle: title })
  }

  render() {

    if (this.state.loading) {
      return (<p>Loading...</p>)
    }


    const { editorDoenetML } = this.state;


    let textEditorMenu = <React.Fragment>
      <select onChange={(e) => this.setState({ fontSize: e.target.value })} value={this.state.fontSize}>
        <option>8</option>
        <option>10</option>
        <option>12</option>
        <option>14</option>
        <option>16</option>
        <option>18</option>
        <option>20</option>
        <option>22</option>
        <option>24</option>
        <option>30</option>
      </select>
    </React.Fragment>




    // console.log(this.state.viewerDoenetML)
    let doenetViewerMenu = <React.Fragment>
      <button onClick={this.handleViewerUpdate}>Update</button>
    </React.Fragment>
    let doenetViewer = (<ErrorBoundary key={"doenetErrorBoundry" + this.updateNumber}>
      <DoenetViewer
        key={"doenetviewer" + this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
        // free={{doenetCode: this.state.viewerDoenetML}} 
        doenetML={this.state.viewerDoenetML}
        mode={{
          solutionType: this.state.solutionType,
          allowViewSolutionWithoutRoundTrip: this.state.allowViewSolutionWithoutRoundTrip,
          showHints: this.state.showHints,
          showFeedback: this.state.showFeedback,
          showCorrectness: this.state.showCorrectness,
        }}
      />
    </ErrorBoundary>)


    let title_text = `${this.state.documentTitle}`;


    return (
      <ToolLayout guestUser={true} toolName="Guest Editor" headingTitle={title_text} leftPanelClose={true} rightPanelWidth="500">
        <ToolLayoutPanel >
          Ignored
        </ToolLayoutPanel>
        <ToolLayoutPanel panelHeaderControls={[doenetViewerMenu]} panelName="Doenet Interactive">
        <div style={{display:'flex', flexDirection:'column'}}> {doenetViewer}</div>
        </ToolLayoutPanel>
        <ToolLayoutPanel panelHeaderControls={[textEditorMenu]} panelName="DoenetML Code">
          <div style={{ width: "100%", height: "calc(100vh - 42px)" }} >
            <MonacoEditor
              width="100vw"
              height="calc(100vh - 40px)"
              language="xml"
              value={editorDoenetML}
              options={{
                selectOnLineNumbers: false,
                minimap: { enabled: false },
                fontSize: this.state.fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                showFoldingControls: "always",
                features: ["folding", "caretOperations", "scrollBeyondLastLine"]
              }}
              onChange={this.onChange}
              editorDidMount={this.editorDidMount}
              theme="vs-light"

            />
          </div>


        </ToolLayoutPanel>

      </ToolLayout>

    );


  }

}

function findNextTag({ code, index }) {
  let tagRegEx = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>/;
  let matchObj = tagRegEx.exec(code);


  if (matchObj === null) { return false; } //no tags so return
  let tagString = matchObj[0];
  //make tags lower case
  tagString = tagString.toLowerCase();
  let tagIndex = matchObj.index;

  //if next tag is a comment find the end of the comment and return the information about the comment.
  let startCommentIndex = code.search('<!--');
  if (startCommentIndex !== -1 && startCommentIndex < tagIndex) {
    let endCommentIndex = code.search('-->');
    let unmatched = false;
    //if no end comment then the rest of the code is commented out
    if (endCommentIndex === -1) { endCommentIndex = code.length; unmatched = true; }
    tagString = code.substring(startCommentIndex, endCommentIndex + 3);
    return { tagString: tagString, tagType: "comment", tagIndex: startCommentIndex, tagProps: { tagString: tagString }, unmatched: unmatched };
  }

  //Find tagType
  let parts = tagString.split(" ");
  let tagType = parts[0].substring(1, parts[0].length - 1);
  if (parts.length > 1) {
    tagType = parts[0].substring(1, parts[0].length);
  }
  if (tagType.substring(tagType.length - 1, tagType.length) === '/') {
    tagType = tagType.substring(0, tagType.length - 1);
  }

  let tagPropsString = matchObj[1];
  tagPropsString = tagPropsString.trim();
  let tagProps = {};

  //Process Double Quoted Props
  let startPropDoubleRegEx = /\w+\s*=\s*["]/;
  matchObj = "not null";  //need this to start the while loop
  while (matchObj !== null) {
    matchObj = startPropDoubleRegEx.exec(tagPropsString);
    if (matchObj !== null) {
      let followingCode = tagPropsString.substring(matchObj.index + matchObj[0].length - 1, tagPropsString.length);
      let doubleQuoteRegEx = /"[^"\\]*(?:\\.[^"\\]*)*"/;
      let doubleMatchObj = doubleQuoteRegEx.exec(followingCode);
      let insideDoubleQuotes = doubleMatchObj[0].substring(1, doubleMatchObj[0].length - 1);
      let nameParts = matchObj[0].split('=');
      let propName = nameParts[0].trim().toLowerCase();
      if (propName.substring(0, 1) === '_') {
        throw Error("The prop " + propName + " is reserved for internal use only.");
      }
      insideDoubleQuotes = insideDoubleQuotes.replace(/\\"/g, '"');
      if (propName in tagProps) {
        throw Error("Duplicate property " + propName + " in tag " + tagType);
      }
      tagProps[propName] = {};
      tagProps[propName].value = insideDoubleQuotes;
      tagProps[propName].quoteType = "double";
      //Find start and end of double quotes
      let indexOfPropName = tagString.search(propName);
      let afterTagName = tagString.substring(indexOfPropName, tagString.length);
      let indexOfDoubleQuote = afterTagName.search(`"`) + 1;
      let afterBeginningDoubleQuote = afterTagName.substring(indexOfDoubleQuote, afterTagName.length);
      let indexOfClosingDoubleQuote = afterBeginningDoubleQuote.search(`"`);
      tagProps[propName].indexOfStartQuote = indexOfPropName + indexOfDoubleQuote + tagIndex + index;
      tagProps[propName].indexOfEndQuote = indexOfPropName + indexOfDoubleQuote + indexOfClosingDoubleQuote + tagIndex + index;

      tagPropsString = tagPropsString.substring(0, matchObj.index) +
        tagPropsString.substring(matchObj.index + matchObj[0].length +
          doubleMatchObj[0].length, tagPropsString.length);
    }
  }

  //Process Single Quoted Props
  let startPropSingleRegEx = /\w+\s*=\s*[']/;
  matchObj = "not null";
  while (matchObj !== null) {
    matchObj = startPropSingleRegEx.exec(tagPropsString);
    if (matchObj !== null) {
      let followingCode = tagPropsString.substring(matchObj.index + matchObj[0].length - 1, tagPropsString.length);
      let singleQuoteRegEx = /'[^'\\]*(?:\\.[^'\\]*)*'/;
      let singleMatchObj = singleQuoteRegEx.exec(followingCode);
      let insideSingleQuotes = singleMatchObj[0].substring(1, singleMatchObj[0].length - 1);
      let nameParts = matchObj[0].split('=');
      let propName = nameParts[0].trim().toLowerCase();
      if (propName.substring(0, 1) === '_') {
        throw Error("The prop " + propName + " is reserved for internal use only.");
      }
      insideSingleQuotes = insideSingleQuotes.replace(/\\'/g, "'");
      if (propName in tagProps) {
        throw Error("Duplicate property " + propName + " in tag " + tagType);
      }
      tagProps[propName] = {};
      tagProps[propName].value = insideSingleQuotes;
      tagProps[propName].quoteType = "single";

      //Find start and end of single quotes
      let indexOfPropName = tagString.search(propName);
      let afterTagName = tagString.substring(indexOfPropName, tagString.length);
      let indexOfSingleQuote = afterTagName.search(`'`) + 1;
      let afterBeginningSingleQuote = afterTagName.substring(indexOfSingleQuote, afterTagName.length);
      let indexOfClosingSingleQuote = afterBeginningSingleQuote.search(`'`);
      tagProps[propName].indexOfStartQuote = indexOfPropName + indexOfSingleQuote + tagIndex + index;
      tagProps[propName].indexOfEndQuote = indexOfPropName + indexOfSingleQuote + indexOfClosingSingleQuote + tagIndex + index;


      tagPropsString = tagPropsString.substring(0, matchObj.index) +
        tagPropsString.substring(matchObj.index + matchObj[0].length +
          singleMatchObj[0].length, tagPropsString.length);

    }
  }


  //Process Unquoted Props
  if (/\S/.test(tagPropsString)) {
    let unquotedParts = tagPropsString.split(" ");
    for (let propName of unquotedParts) {
      if (/\S/.test(propName)) {
        propName = propName.trim();
        tagProps[propName] = {};
        tagProps[propName].value = true;
        tagProps[propName].quoteType = "none";
        //Find index right after propname
        let indexOfPropName = tagString.search(propName);
        tagProps[propName].endPropNameIndex = indexOfPropName + propName.length + tagIndex + index;
      }
    }
  }

  return { tagString: tagString, tagType: tagType, tagIndex: tagIndex, tagProps: tagProps };
}

export default DoenetGuestEditor;