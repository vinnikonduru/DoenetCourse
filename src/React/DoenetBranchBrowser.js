import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFolder, faArrowUp, 
  faArrowDown, faDotCircle, faEdit, faArrowRight, faFolderOpen, faLink} from '@fortawesome/free-solid-svg-icons';
import "./branchBrowser.css";
import SpinningLoader from './SpinningLoader';
import styled from 'styled-components';
import DropItem from "./TreeView/components/drop-item";
import DragItem from "./TreeView/components/drag-item";
import { formatTimestamp } from './chooser/utility';


class DoenetBranchBrowser extends Component {
  static defaultProps = {
    addContentToFolder: null,
    addContentToRepo: null,
    removeContentFromFolder: null,
    selectedDrive: "Content",
    selectedCourse: null,
    directoryData: [],
    selectedItems: [],
    selectedItemsType: [],
  }
  constructor(props) {
    super(props);

    this.state = {
      directoryStack: props.directoryData,
      selectedItems: props.selectedItems,
      selectedItemsType: props.selectedItemsType,
      sortBy: "title",
      sortOrderAsc: "ASC",
    }

    // handle null props
    this.hideAddRemoveButtons = this.disableEditing = this.props.addContentToFolder === null
                     || this.props.removeContentFromFolder === null;

    this.handleAddContentToFolder = this.handleAddContentToFolder.bind(this);
    this.handleRemoveContentFromCurrentFolder = this.handleRemoveContentFromCurrentFolder.bind(this);
    this.handleRemoveContentFromCourse = this.handleRemoveContentFromCourse.bind(this);
    this.handleContentItemClick = this.handleContentItemClick.bind(this);
    this.handleContentItemDoubleClick = this.handleContentItemDoubleClick.bind(this);
    this.handleFolderDoubleClick = this.handleFolderDoubleClick.bind(this);
    this.handleUrlItemDoubleClick = this.handleUrlItemDoubleClick.bind(this);
    this.upOneDirectory = this.upOneDirectory.bind(this);
    this.openFolder = this.openFolder.bind(this);
    this.pushDirectoryStack = this.pushDirectoryStack.bind(this);
    this.popDirectoryStack = this.popDirectoryStack.bind(this);
    this.peekDirectoryStack = this.peekDirectoryStack.bind(this);
    this.getAllSelectedItems = this.getAllSelectedItems.bind(this);
    this.flattenFolder = this.flattenFolder.bind(this);
    this.jumpToDirectory = this.jumpToDirectory.bind(this);
    this.updateSortOrder = this.updateSortOrder.bind(this);
    this.sortContent = this.sortContent.bind(this);
    this.sortFolders = this.sortFolders.bind(this);
    this.sortUrls = this.sortUrls.bind(this);
    this.openEditUrlForm = this.openEditUrlForm.bind(this);
    this.onDragStartCb = this.onDragStartCb.bind(this);
    this.onDragEndCb = this.onDragEndCb.bind(this);
  }

  getAllSelectedItems() {
    let allSelectedContent = [];
    for (let i =0; i < this.state.selectedItemsType.length; i++) {
      if (this.state.selectedItemsType[i] === "folder") {
        // flatten folders to get all content
        allSelectedContent = allSelectedContent.concat(this.flattenFolder(this.state.selectedItems[i]));
      } else {
        allSelectedContent.push({
          branchId: this.state.selectedItems[i],
          contentIds: this.props.allContentInfo[this.state.selectedItems[i]].contentIds
        });
      }
    }

    return allSelectedContent;
  }

  flattenFolder(folderId) {
    let itemIds = [];
    let childFolder = this.props.allFolderInfo[folderId].childFolders;
    childFolder.forEach((childFolderId) => {
      itemIds = itemIds.concat(this.flattenFolder(childFolderId));
    })
    this.props.allFolderInfo[folderId].childContent.forEach((childContentBranchId) => {
      itemIds.push({
        branchId: childContentBranchId,
        contentIds: this.props.allContentInfo[childContentBranchId].contentIds
      });
    })
    return itemIds;
  }

  handleAddContentToFolder(folderId) {
    let selectedItemsWithoutRepo = [];
    let selectedItemsTypeWithoutRepo = [];
    
    this.state.selectedItems.forEach((itemId, index) => {
      if (this.state.selectedItemsType[index] == "content" || 
          this.state.selectedItemsType[index] == "url" ||
          (this.state.selectedItemsType[index] == "folder" && !this.props.allFolderInfo[itemId].isRepo)) {
        selectedItemsWithoutRepo.push(itemId);
        selectedItemsTypeWithoutRepo.push((this.state.selectedItemsType[index]));
      }
    });

    if (this.props.allFolderInfo[folderId].isRepo) {
      this.props.addContentToRepo(selectedItemsWithoutRepo, selectedItemsTypeWithoutRepo, folderId);
    } else {
      this.props.addContentToFolder(selectedItemsWithoutRepo, selectedItemsTypeWithoutRepo, folderId);
    }
    this.setState({selectedItems: [], selectedItemType: []});
  }

  handleRemoveContentFromCurrentFolder() {
    let folderId = this.peekDirectoryStack();
    this.props.removeContentFromFolder(this.state.selectedItems, this.state.selectedItemsType, folderId);
    this.setState({selectedItems: [], selectedItemType: []});
  }

  handleRemoveContentFromCourse() {
    this.props.removeContentFromCourse(this.state.selectedItems);
  }

  buildBreadcrumb() {
    let directoryList = [];
    // build directory list
    // always add current drive/course as first item
    directoryList.push(
      <div 
      onClick={() => this.jumpToDirectory("")} 
      key="breadcrumbDrive"
      data-cy="breadcrumbbase">
        <label>
          {this.props.selectedDrive === "Courses" ? 
            this.props.allCourseInfo[this.props.selectedCourse].courseCode 
            : this.props.selectedDrive}
        </label>
      </div>
    );

    // add items in directoryStack if any
    this.state.directoryStack.forEach((folderId) => {
      let folderTitle = this.props.allFolderInfo[folderId].title;

      directoryList.push(
        <div 
        onClick={() => this.jumpToDirectory(folderId)} 
        key={"breadcrumb"+folderId}
        data-cy={"breadcrumb"+folderId}>
          <label>{folderTitle}</label>
        </div>
      );
    });

    this.breadcrumb = <Breadcrumb separator='>'>
                        {directoryList}
                      </Breadcrumb>;
  }

  buildFolderItems() {
    this.folderItems = [];
    this.folderList = this.props.folderList;
    // show items in current directory
    if (this.state.directoryStack.length !== 0) {
      let folderId = this.peekDirectoryStack();
      this.folderList = this.props.allFolderInfo[folderId].childFolders;
    }
    this.sortFolders();
    
    this.tableIndex = 0;
    // create table row items to be rendered in chooser
    for (let folderId of this.folderList){
      let title = this.props.allFolderInfo[folderId].title;
      let publishDate = formatTimestamp(this.props.allFolderInfo[folderId].publishDate);
      let childContent = this.props.allFolderInfo[folderId].childContent;
      let childUrls = this.props.allFolderInfo[folderId].childUrls;
      let childFolder = this.props.allFolderInfo[folderId].childFolder;
      let isRepo = this.props.allFolderInfo[folderId].isRepo;
      let isPublic = this.props.allFolderInfo[folderId].isPublic;
      let isShared = this.props.allFolderInfo[this.props.allFolderInfo[folderId].rootId].isRepo;
      let classes = this.state.selectedItems.includes(folderId) ?
                      "browserDataRow browserSelectedRow": "browserDataRow";
      
      let showRemoveItemIcon = false;
      let showAddItemIcon = true;
      if (this.props.selectedDrive === "Content") {
        // disable remove content in base dir when in mycontent
        let notInBaseDirOfContent = this.state.directoryStack.length !== 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons && 
                              notInBaseDirOfContent &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(folderId);

        showAddItemIcon = !this.hideAddRemoveButtons &&
                          this.state.selectedItems.length !== 0 &&
                          !this.state.selectedItems.includes(folderId) &&
                          !this.state.selectedItems.includes(this.state.directoryStack[this.state.directoryStack.length - 1]);

      } else if (this.props.selectedDrive === "Courses") {
        // disable remove content when not in base dir
        let inBaseDir = this.state.directoryStack.length === 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons &&
                              inBaseDir &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(folderId);
        // restrict content editing in courses
        showAddItemIcon = false;
      }


      this.folderItems.push(
        <Folder      
          onClick={this.handleContentItemClick}
          onDoubleClick={this.openFolder}
          title={title}
          publishDate={publishDate}
          draftDate={" — "}
          childContent={childContent}
          childUrls={childUrls}
          childFolder={childFolder}
          folderId={folderId}
          isRepo={isRepo}
          isPublic={isPublic}
          isShared={isShared}
          classes={classes}
          key={"folder" + folderId}
          tableIndex={this.tableIndex++}
          handleAddContentToFolder={this.handleAddContentToFolder}
          showAddItemIcon={showAddItemIcon}
          showRemoveItemIcon={showRemoveItemIcon}
          handleRemoveContent={this.props.selectedDrive === "Content" ? 
                              this.handleRemoveContentFromCurrentFolder :
                              this.handleRemoveContentFromCourse}
          renameFolder={this.props.renameFolder}/>
      );
    }
  }
  
  buildContentItems(){
    this.contentItems = [];
    this.contentList = this.props.contentList;
    // show items in current directory
    if (this.state.directoryStack.length !== 0) {
      let folderId = this.peekDirectoryStack();
      this.contentList = this.props.allFolderInfo[folderId].childContent;
    }
    this.sortContent();

    // build files
    for (let branchId of this.contentList){
      let title = this.props.allContentInfo[branchId].title;
      let publishDate = formatTimestamp(this.props.allContentInfo[branchId].publishDate);
      let draftDate = formatTimestamp(this.props.allContentInfo[branchId].draftDate);
      let isShared = this.props.allContentInfo[branchId].rootId == "root" ? false :
        this.props.allFolderInfo[this.props.allContentInfo[branchId].rootId].isRepo;
      let isPublic = this.props.allContentInfo[branchId].isPublic;
      let classes = this.state.selectedItems.includes(branchId) ?
                      "browserDataRow browserSelectedRow": "browserDataRow";
      
      let showRemoveItemIcon = false;
      if (this.props.selectedDrive === "Content") {
        // disable remove content in base dir when in mycontent
        let notInBaseDirOfContent = this.state.directoryStack.length !== 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons && 
                              notInBaseDirOfContent &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(branchId);

      } else if (this.props.selectedDrive === "Courses") {
        // disable remove content when not in base dir
        let inBaseDir = this.state.directoryStack.length === 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons &&
                              inBaseDir &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(branchId);
      }

      // create table row items to be rendered in chooser
      this.contentItems.push(
        <File
        branchId={branchId}
        classes={classes}
        onClick={this.handleContentItemClick}
        onDoubleClick={this.handleContentItemDoubleClick}
        title={title}
        publishDate={publishDate}
        draftDate={draftDate}
        isShared={isShared}
        isPublic={isPublic}
        key={"contentItem" + branchId}
        tableIndex={this.tableIndex++}
        showRemoveItemIcon={showRemoveItemIcon}
        handleRemoveContent={this.props.selectedDrive === "Content" ? 
                            this.handleRemoveContentFromCurrentFolder :
                            this.handleRemoveContentFromCourse}
        onDragStart={this.onDragStartCb}
        onDragEnd={this.onDragEndCb}
        onDragOver={this.props.onDraggableDragOver}/>);
        
    }
  }

  buildUrlItems(){
    this.urlItems = [];
    this.urlList = this.props.urlList;
    console.log(this.urlList)
    // show items in current directory
    if (this.state.directoryStack.length !== 0) {
      let folderId = this.peekDirectoryStack();
      this.urlList = this.props.allFolderInfo[folderId].childUrls;
    }
    this.sortUrls();

    // build urls
    for (let urlId of this.urlList){
      let title = this.props.allUrlInfo[urlId].title;
      let url = this.props.allUrlInfo[urlId].url;
      let description = this.props.allUrlInfo[urlId].description;
      let publishDate = formatTimestamp(this.props.allUrlInfo[urlId].publishDate);
      let isShared = this.props.allUrlInfo[urlId].rootId == "root" ? false :
        this.props.allFolderInfo[this.props.allUrlInfo[urlId].rootId].isRepo;
      let isPublic = this.props.allUrlInfo[urlId].isPublic;
      let classes = this.state.selectedItems.includes(urlId) ?
                      "browserDataRow browserSelectedRow": "browserDataRow";
      
      let showRemoveItemIcon = false;
      if (this.props.selectedDrive === "Content") {
        // disable remove content in base dir when in mycontent
        let notInBaseDirOfContent = this.state.directoryStack.length !== 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons && 
                              notInBaseDirOfContent &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(urlId);

      } else if (this.props.selectedDrive === "Courses") {
        // disable remove content when not in base dir
        let inBaseDir = this.state.directoryStack.length === 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons &&
                              inBaseDir &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(urlId);
      }

      // create table row items to be rendered in chooser
      this.urlItems.push(
        <Url
        urlId={urlId}
        classes={classes}
        onClick={this.handleContentItemClick}
        onDoubleClick={this.handleUrlItemDoubleClick}
        title={title}
        url={url}
        publishDate={publishDate}
        description={description}
        isShared={isShared}
        isPublic={isPublic}
        key={"urlItem" + urlId}
        tableIndex={this.tableIndex++}
        showRemoveItemIcon={showRemoveItemIcon}
        handleRemoveContent={this.props.selectedDrive === "Content" ? 
                            this.handleRemoveContentFromCurrentFolder :
                            this.handleRemoveContentFromCourse}/>);
        
    }
  }

  handleContentItemClick (itemId, type, tableIndex) {
    // show content/folder info on infoPanel
    // check for keystroke
    if (window.event.ctrlKey || window.event.metaKey) {
      let currentSelectedItems = this.state.selectedItems;
      let currentSelectedItemsType = this.state.selectedItemsType;
      let index = currentSelectedItems.indexOf(itemId);
      if (index > -1) {
        currentSelectedItems.splice(index, 1);
        currentSelectedItemsType.splice(index, 1);
      } else {
        currentSelectedItems.push(itemId);
        currentSelectedItemsType.push(type);
      }

      this.setState({
        selectedItems: currentSelectedItems,
        selectedItemsType: currentSelectedItemsType
      });
      
      if (this.props.updateSelectedItems !== null) {
        this.props.updateSelectedItems(currentSelectedItems, currentSelectedItemsType);
      }
    } else if (window.event.shiftKey) {
      let currentSelectedItems = this.state.selectedItems;
      let currentSelectedItemsType = this.state.selectedItemsType;
      
      let allTableItems = this.folderList.concat(this.contentList, this.urlList);

      // if no previous items selected
      if (currentSelectedItems.length === 0) {
        // select current item
        this.setState({
          selectedItems: [itemId],
          selectedItemsType: [type]
        });

        if (this.props.updateSelectedItems !== null) {
          this.props.updateSelectedItems([itemId], [type]);
        }
        return;
      }
      
      // get lastSelectedItemIndex, currentSelectedItemIndex
      let lastSelectedItemIndex = allTableItems.indexOf(currentSelectedItems[currentSelectedItems.length - 1]);
      let currentSelectedItemIndex = tableIndex;

      // maintain last < current order
      if (currentSelectedItemIndex < lastSelectedItemIndex) {
        let temp = lastSelectedItemIndex;
        lastSelectedItemIndex = currentSelectedItemIndex;
        currentSelectedItemIndex = temp;
      }

      // select all items between last and current
      while (lastSelectedItemIndex <= currentSelectedItemIndex) {
        // get id and type of item to be selected
        let currentItemId = allTableItems[lastSelectedItemIndex];
        let currentItemType = "content";
        if (this.props.allContentInfo[currentItemId] === undefined) {
          currentItemType =  this.props.allFolderInfo[currentItemId] === undefined ? "url" : "folder";
        }

        // check if already inside, if true then continue
        if (!currentSelectedItems.includes(currentItemId)) {
          currentSelectedItems.push(currentItemId);
          currentSelectedItemsType.push(currentItemType);
        }
        lastSelectedItemIndex++;
      }
    
      this.setState({
        selectedItems: currentSelectedItems,
        selectedItemsType: currentSelectedItemsType
      });


      if (this.props.updateSelectedItems !== null) {
        this.props.updateSelectedItems(currentSelectedItems, currentSelectedItemsType);
      }
    } else {
      this.setState({
        selectedItems: [itemId],
        selectedItemsType: [type]
      });

      if (this.props.updateSelectedItems !== null) {
        this.props.updateSelectedItems([itemId], [type]);
      }
    }    
  }

  handleContentItemDoubleClick(branchId) {
    if (!this.disableEditing) {
      // redirect to editor
      window.location.href=`/editor?branchId=${branchId}`;
      this.props.updateSelectedItems([branchId], ["content"]);
    }
  }

  handleFolderDoubleClick(folderId) {
    this.setState({
      currentDirectory: folderId
    });
  }

  handleUrlItemDoubleClick(urlId) {
      window.location.href = this.props.allUrlInfo[urlId].url;
  }

  pushDirectoryStack(folderId) {
    let directoryStack = this.state.directoryStack;
    directoryStack.push(folderId);
    this.setState({
      directoryStack: directoryStack
    }); 
  }

  popDirectoryStack() {
    let directoryStack = this.state.directoryStack;
    directoryStack.pop();
    this.setState({
      directoryStack: directoryStack
    });
  }

  peekDirectoryStack() {
    return this.state.directoryStack[this.state.directoryStack.length - 1];
  }

  openFolder(folderId) {
    this.pushDirectoryStack(folderId);
    this.setState({selectedItems: [], selectedItemType: []});
    if (this.props.updateDirectoryStack !== null) {
      this.props.updateDirectoryStack(this.state.directoryStack);
    }
  }

  upOneDirectory() {
    this.popDirectoryStack();
    this.setState({selectedItems: [], selectedItemType: []});
    if (this.props.updateDirectoryStack !== null) {
      this.props.updateDirectoryStack(this.state.directoryStack);
    }
  }

  jumpToDirectory(folderId) {
    // pop all items after folderId
    this.setState({selectedItems: [], selectedItemType: []});
    while (this.state.directoryStack.length > 0 && this.peekDirectoryStack() !== folderId) {
      this.upOneDirectory();      
    }
  }

  openEditUrlForm() {
    this.props.updateSelectedItems(
      [this.state.selectedItems[this.state.selectedItems.length - 1]],
      [this.state.selectedItemsType[this.state.selectedItemsType.length - 1]]);
    this.props.openEditUrlForm();
  }

  updateSortOrder(colName) {
    if (colName !== this.state.sortBy) {
      this.setState({sortBy: colName, sortOrderAsc: true});
    } else {
      this.setState({sortOrderAsc: !this.state.sortOrderAsc});
    }
  }

  sortContent() {
    if (this.state.sortOrderAsc) {
      if (this.state.sortBy === "publishedDate") {
        this.contentList.sort(
          (a,b) => { 
            return new Date(this.props.allContentInfo[a].publishDate) - new Date(this.props.allContentInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "draftDate") {
        this.contentList.sort(
          (a,b) => { 
            return new Date(this.props.allContentInfo[a].draftDate) - new Date(this.props.allContentInfo[b].draftDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.contentList.sort(
          (a,b) => { 
            return (this.props.allContentInfo[a].title.localeCompare(this.props.allContentInfo[b].title))}
        );
      }
    } else {
      if (this.state.sortBy === "publishedDate") {
        this.contentList.sort(
          (b,a) => { 
            return new Date(this.props.allContentInfo[a].publishDate) - new Date(this.props.allContentInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "draftDate") {
        this.contentList.sort(
          (b,a) => { 
            return new Date(this.props.allContentInfo[a].draftDate) - new Date(this.props.allContentInfo[b].draftDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.contentList.sort(
          (b,a) => { 
            return (this.props.allContentInfo[a].title.localeCompare(this.props.allContentInfo[b].title))}
        );
      }
    }
  }

  sortUrls() {
    if (this.state.sortOrderAsc) {
      if (this.state.sortBy === "publishedDate") {
        this.urlList.sort(
          (a,b) => { 
            return new Date(this.props.allUrlInfo[a].publishDate) - new Date(this.props.allUrlInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "draftDate") {
        this.urlList.sort(
          (a,b) => { 
            return new Date(this.props.allUrlInfo[a].draftDate) - new Date(this.props.allUrlInfo[b].draftDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.urlList.sort(
          (a,b) => { 
            return (this.props.allUrlInfo[a].title.localeCompare(this.props.allUrlInfo[b].title))}
        );
      }
    } else {
      if (this.state.sortBy === "publishedDate") {
        this.urlList.sort(
          (b,a) => { 
            return new Date(this.props.allUrlInfo[a].publishDate) - new Date(this.props.allUrlInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "draftDate") {
        this.urlList.sort(
          (b,a) => { 
            return new Date(this.props.allUrlInfo[a].draftDate) - new Date(this.props.allUrlInfo[b].draftDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.urlList.sort(
          (b,a) => { 
            return (this.props.allUrlInfo[a].title.localeCompare(this.props.allUrlInfo[b].title))}
        );
      }
    }
  }

  sortFolders() {
    if (this.state.sortOrderAsc) {
      if (this.state.sortBy === "publishedDate") {
        this.folderList.sort(
          (a,b) => { 
            if (this.props.allFolderInfo[a].isRepo && !this.props.allFolderInfo[b].isRepo) return -1;
            if (!this.props.allFolderInfo[a].isRepo && this.props.allFolderInfo[b].isRepo) return 1;
            return (new Date(this.props.allFolderInfo[a].publishDate) - new Date(this.props.allFolderInfo[b].publishDate))
          });
      } else if (this.state.sortBy === "title") {
        this.folderList.sort(
          (a,b) => { 
            if (this.props.allFolderInfo[a].isRepo && !this.props.allFolderInfo[b].isRepo) return -1;
            if (!this.props.allFolderInfo[a].isRepo && this.props.allFolderInfo[b].isRepo) return 1;
            return (this.props.allFolderInfo[a].title.localeCompare(this.props.allFolderInfo[b].title));}
        );
      }
    }else {
      if (this.state.sortBy === "publishedDate") {
        this.folderList.sort(
          (b,a) => { 
            if (this.props.allFolderInfo[a].isRepo && !this.props.allFolderInfo[b].isRepo) return 1;
            if (!this.props.allFolderInfo[a].isRepo && this.props.allFolderInfo[b].isRepo) return -1;
            return new Date(this.props.allFolderInfo[a].publishDate) - new Date(this.props.allFolderInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.folderList.sort(
          (b,a) => { 
            if (this.props.allFolderInfo[a].isRepo && !this.props.allFolderInfo[b].isRepo) return 1;
            if (!this.props.allFolderInfo[a].isRepo && this.props.allFolderInfo[b].isRepo) return -1;
            return (this.props.allFolderInfo[a].title.localeCompare(this.props.allFolderInfo[b].title));}
        );
      }
    }
  }

  onDragStartCb(draggedId, draggedType) {
    this.props.onDragStart && 
      this.props.onDragStart({
        draggedId: draggedId, 
        draggedType: draggedType, 
        sourceContainerId: this.props.containerId, 
        parentsInfo: this.props.allFolderInfo, 
        leavesInfo: this.props.allContentInfo });
  }

  onDragEndCb() {
    this.props.onDragEnd && 
      this.props.onDragEnd({
        containerId: this.props.containerId, 
        parentsInfo: this.props.allFolderInfo, 
        leavesInfo: this.props.allContentInfo });
  }

  render() {

    if (this.props.loading){
      return <div id="branchBrowser" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
              <SpinningLoader/>
             </div>
    }

    this.buildBreadcrumb();
    this.buildFolderItems();
    this.buildContentItems();
    this.buildUrlItems();

    return(
      <React.Fragment>
        <div id="branchBrowser">
          <div id="contentList">
            {this.breadcrumb}
              <table id="browser">
                <tbody>
                  <tr className="browserHeadingsRow" key="browserHeadingsRow">
                    <th 
                    className={this.state.sortBy === "title" ? "browserItemName browserSelectedHeading" : "browserItemName"}
                    onClick={() => this.updateSortOrder("title")}>
                      Name   {this.state.sortBy === "title" ? this.state.sortOrderAsc ? 
                                                            <FontAwesomeIcon icon={faArrowUp} className="sortOrderIcon"/> :
                                                            <FontAwesomeIcon icon={faArrowDown} className="sortOrderIcon"/> : ""}
                    </th>
                    <th 
                    className={this.state.sortBy === "draftDate" ? "draftDate browserSelectedHeading" : "draftDate"}
                    onClick={() => this.updateSortOrder("draftDate")}>
                      Draft Date   {this.state.sortBy === "draftDate" ? this.state.sortOrderAsc ? 
                                                            <FontAwesomeIcon icon={faArrowUp} className="sortOrderIcon"/> :
                                                            <FontAwesomeIcon icon={faArrowDown} className="sortOrderIcon"/> : ""}
                    </th>
                    <th 
                    className={this.state.sortBy === "publishedDate" ? "publishDate browserSelectedHeading" : "publishDate"}
                    onClick={() => this.updateSortOrder("publishedDate")}>
                      Published Date  {this.state.sortBy === "publishedDate" ? this.state.sortOrderAsc ? 
                                                            <FontAwesomeIcon icon={faArrowUp} className="sortOrderIcon"/> :
                                                            <FontAwesomeIcon icon={faArrowDown} className="sortOrderIcon"/> : ""}
                    </th>
                  </tr>
                  {this.state.directoryStack.length !== 0 &&
                  <tr
                  className="browserDataRow"
                  data-cy="upOneDirectory"
                  onDoubleClick={this.upOneDirectory}>
                    <td className="browserItemName">
                      <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>
                      <span>{"..."}</span>
                    </td>
                    <td className="draftDate"></td>
                    <td className="publishDate"></td>
                  </tr>}
                  {this.folderList.length == 0 && this.contentList.length == 0 && this.urlList.length == 0 &&
                    <div id="browserEmptyMessage"><span>Create new files or folders using the New button</span></div>}
                  {this.folderItems}
                  {this.contentItems}
                  {this.urlItems}
                </tbody>
              </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const File = ({ branchId, classes, onClick, onDoubleClick, title, publishDate,
  draftDate, isShared, isPublic, tableIndex, showRemoveItemIcon, handleRemoveContent,
  onDragStart, onDragOver, onDragEnd }) => {

  const onDraggableDragOverCb = (listId) => {
    onDragOver(listId, "content")
  }

  const onDragStartCb = (draggedId) => {
    onDragStart(draggedId, "content");
  }

  return(
    <DragItem id={branchId} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      <>
      <tr
      className={classes}
      onClick={() => onClick(branchId, "content", tableIndex)}
      onDoubleClick={() => onDoubleClick(branchId)}
      data-cy={branchId}>
        <td className="browserItemName">
          {isShared && isPublic ? 
            <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/> :
            <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3D6EC9", "margin": "0px 15px"}}/>}
          <span>{title}</span>
        </td>
        <td className="draftDate">
          <span>{draftDate}</span>
        </td>
        <td className="publishDate">
          <div style={{"position":"relative"}}>
            {showRemoveItemIcon && 
            <div className="removeContentButtonWrapper">
              <FontAwesomeIcon icon={faArrowRight} className="removeContentButton" 
              onClick={() => handleRemoveContent(branchId)}/>
              <div className="removeContentButtonInfo"><span>Move out folder</span></div>
            </div>}
            <span>{publishDate}</span>
          </div>          
        </td>
      </tr>
      </>
    </DragItem>
  );
}

class Url extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return(
      <tr
      className={this.props.classes}
      onClick={() => this.props.onClick(this.props.urlId, "url", this.props.tableIndex)}
      onDoubleClick={() => this.props.onDoubleClick(this.props.urlId)}
      data-cy={this.props.urlId}>
        <td className="browserItemName">
          {this.props.isShared && this.props.isPublic ? 
            <FontAwesomeIcon icon={faLink} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/> :
            <FontAwesomeIcon icon={faLink} style={{"fontSize":"18px", "color":"#3D6EC9", "margin": "0px 15px"}}/>}
          <span>{this.props.title}</span>
        </td>
        <td className="draftDate">
          <span>-</span>
        </td>
        <td className="publishDate">
          <div style={{"position":"relative"}}>
            {this.props.showRemoveItemIcon && 
            <div className="removeContentButtonWrapper">
              <FontAwesomeIcon icon={faArrowRight} className="removeContentButton" 
              onClick={() => this.props.handleRemoveContent(this.props.urlId)}/>
              <div className="removeContentButtonInfo"><span>Move out folder</span></div>
            </div>}
            <span>{this.props.publishDate}</span>
          </div>          
        </td>
      </tr>
    );
  }
}

class Folder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title
    }
    this.previousTitle = this.props.title;

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleTitleChange(e) {
    if (e.target.textContent == "") return;
    
    if (e.target.textContent !== this.state.title) {
      this.props.renameFolder(this.props.folderId, e.target.textContent);
      this.setState({
        title: e.target.textContent
      });
    }
  }

  handleKeyPress(e) {
    if (e.keyCode == 13) {  
      event.preventDefault(); 
      event.stopPropagation();
      e.target.blur();  // calls handleTitleChange automatically
    } 
  }

  render() {
    let folderIcon = <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>;
    if (this.props.isRepo) {
      folderIcon = this.props.isPublic ?
          <FontAwesomeIcon icon={faFolderOpen} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/> :
          <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/>;
    } else if (this.props.isShared && this.props.isPublic) {
      folderIcon = <FontAwesomeIcon icon={faFolderOpen} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>;
    }

    return(
      <tr
      className={this.props.classes}
      onClick={() => this.props.onClick(this.props.folderId, "folder", this.props.tableIndex)}
      onDoubleClick={() => this.props.onDoubleClick(this.props.folderId)}
      data-cy={this.props.folderId}>
        <td className="browserItemName">
          <div style={{"position":"relative"}}>
            {this.props.showAddItemIcon && 
            <div className="addContentButtonWrapper">
              <FontAwesomeIcon icon={faArrowRight} className="addContentButton" 
              onClick={() => this.props.handleAddContentToFolder(this.props.folderId)}/>
              <div className="addContentButtonInfo"><span>Move to Folder</span></div>
            </div>}
            {folderIcon}
            <span
            contentEditable="true"
            onKeyDown={(e) => {this.handleKeyPress(e)}}
            onBlur={(e) => this.handleTitleChange(e)}
            suppressContentEditableWarning={true}
            >{this.state.title}</span>
          </div>          
        </td>
        <td className="draftDate">
          <span>{this.props.draftDate}</span>
        </td>
        <td className="publishDate">
          <div style={{"position":"relative"}}>
            {this.props.showRemoveItemIcon && 
            <div className="removeContentButtonWrapper">
              <FontAwesomeIcon icon={faArrowRight} className="removeContentButton" 
              onClick={() => this.props.handleRemoveContent(this.props.folderId)}/>
              <div className="removeContentButtonInfo"><span>Move out folder</span></div>
            </div>}
            <span>{this.props.publishDate}</span>
          </div>          
        </td>
      </tr>
    );
  }
}


const BreadcrumbItem = ({ children, ...props }) => (
  <li className='breadcrumbItem' {...props}>
    {children}
  </li>
)

const BreadcrumbSeparator = ({ children, ...props }) => (
  <li className='breadcrumbSeparator' {...props}>
    {children}
  </li>
)

const Breadcrumb = ({ separator = '/', ...props }) => {
  let children = React.Children.toArray(props.children)

  children = children.map((child, index) => (
    <BreadcrumbItem key={`breadcrumbItem${index}`}>{child}</BreadcrumbItem>
  ));

  const lastIndex = children.length - 1;

  children = children.reduce((acc, child, index) => {
    let notLast = index < lastIndex;
    if (notLast) {
      acc.push(
        child,
        <BreadcrumbSeparator key={`breadcrumbSep${index}`}>
          {separator}
        </BreadcrumbSeparator>,
      )
    } else {
      acc.push(child);
    }
    return acc;
  }, [])

  return (<ol className="breadcrumbList">{children}</ol>);
}

export default DoenetBranchBrowser;