var ContentItemBuilder = React.createClass({

  propTypes: {
    data: React.PropTypes.string,
    returnUrl: React.PropTypes.string,
    ltiVersion: React.PropTypes.string,
    ltiLaunchUrl: React.PropTypes.string,
    textFileUrl: React.PropTypes.string,
    ccFileUrl: React.PropTypes.string,
    documentTargets: React.PropTypes.array,
    mediaTypes: React.PropTypes.array
  },

  //getInitialState: function () {
  //  return {
  //    contentItems: "",
  //    ltiMsg: "",
  //    ltiLog: "",
  //    ltiErrorMsg: "",
  //    ltiErrorLog: "",
  //    contentItems: {
  //      "@context": "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
  //      "@graph": [{
  //        "@type": "LtiLink",
  //        "@id": this.props.ltiLaunchUrl,
  //        "url": this.props.ltiLaunchUrl,
  //        "title": "Test Lti Tool",
  //        "text": "Content Item",
  //        "mediaType": "application/vnd.ims.lti.v1.launch+json",
  //        "placementAdvice": {
  //          "displayWidth": 800,
  //          "presentationDocumentTarget": 'iframe',
  //          "displayHeight": 600
  //        }
  //      }]
  //    }
  //  };
  //},
  //
  //
  //
  //contentItemChangeHandler: function (e) {
  //  var contentItem = this.state.contentItems["@graph"][0]
  //  var contentItemType = React.findDOMNode(this.refs.contentItemType);
  //  var documentTarget = React.findDOMNode(this.refs.documentTarget);
  //  contentItem["@type"] = contentItemType.options[contentItemType.selectedIndex].value;
  //  delete contentItem.copyAdvice
  //  switch(contentItem["@type"]) {
  //    case "FileItem":
  //      contentItem['@id'] = this.props.textFileUrl;
  //      contentItem.url = this.props.textFileUrl;
  //      contentItem.mediaType = "text/plain";
  //      contentItem.copyAdvice = true;
  //      break;
  //    default:
  //    case "LtiLink":
  //      contentItem['@id'] = this.props.ltiLaunchUrl;
  //      contentItem.url = this.props.ltiLaunchUrl;
  //      contentItem.mediaType = "application/vnd.ims.lti.v1.launch+json";
  //  }
  //  contentItem.title = React.findDOMNode(this.refs.contentItemTitle).value;
  //  contentItem.text = React.findDOMNode(this.refs.contentItemText).value;
  //  contentItem.placementAdvice.displayWidth = React.findDOMNode(this.refs.contentItemWidth).value;
  //  contentItem.placementAdvice.displayHeight = React.findDOMNode(this.refs.contentItemHeight).value;
  //  contentItem.placementAdvice.presentationDocumentTarget = documentTarget.options[documentTarget.selectedIndex].value;
  //  this.setState({
  //    contentItems: {
  //      "@context": "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
  //      "@graph": [contentItem]
  //    }
  //  });
  //},


  getInitialState: function () {
    return {
      contentItems: {
        "@context": "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
        "@graph": []
      }
    };
  },

  updateContentItems: function () {
    this.setState({contentItems: this.refs.contentItemsElement.toJSON()});
  },

  render: function () {
    return (
      <div style={{'background': 'white'}} >
        <ContentItemBuilder.ContentItems
          ltiLaunchUrl={this.props.ltiLaunchUrl}
          textFileUrl={this.props.textFileUrl}
          ccFileUrl={this.props.ccFileUrl}
          documentTargets={this.props.documentTargets}
          mediaTypes={this.props.mediaTypes}
          updateContentItems={this.updateContentItems}
          ref="contentItemsElement"
          />
        <hr/>
        <ContentItemBuilder.ContentItemMessage
          data={this.props.data}
          returnUrl={this.props.returnUrl}
          ltiVersion={this.props.ltiVersion}
          contentItems={this.state.contentItems}
        />
      </div>
    );
  }
});