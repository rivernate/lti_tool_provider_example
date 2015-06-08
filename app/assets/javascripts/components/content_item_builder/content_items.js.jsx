ContentItemBuilder.ContentItems = React.createClass({

  propTypes: {
    initialContentItems: React.PropTypes.array,
    ltiLaunchUrl: React.PropTypes.string,
    textFileUrl: React.PropTypes.string,
    ccFileUrl: React.PropTypes.string,
    documentTargets: React.PropTypes.array,
    mediaTypes: React.PropTypes.array,
    updateContentItems: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {contentItems: (this.props.initialContentItems || [])};
  },

  addRowHandler: function () {
    var contentItems = this.state.contentItems;
    contentItems.push({
      title: '',
      text: '',
      type: '',
      width: "300",
      height: "300",
      presentationTarget: '',
      windowTarget: ''
    });
    this.setState({contentItems: contentItems});
  },

  handleDelete: function (index) {
    var contentItems = this.state.contentItems;
    contentItems.splice(index, 1);
    this.setState({contentItems: contentItems, updateForm: true});
  },

  handleChange: function(index, data) {
    this.state.contentItems[index][data[0]] = data[1];
    this.props.updateContentItems();
  },

  itemTemplate: function (contentItem) {
    var retVal = this.baseContentItemJSON(contentItem);
    switch (contentItem.type) {
      case "Lti Link":
        retVal.url = this.props.ltiLaunchUrl;
        retVal.type = 'LtiLink';
        retVal.mediaType = 'application/vnd.ims.lti.v1.ltilink';
        break;
      case "File Item":
        retVal.url = this.props.textFileUrl;
        retVal.type = 'FileItem';
        retVal.mediaType = 'text/plain';
        break;
      case "CC":
        retVal.url = this.props.ccFileUrl;
        retVal.type = 'FileItem';
        retVal.mediaType = 'application/zip';
        break;
    }
    return retVal;
  },

  baseContentItemJSON: function (contentItem) {
    return {
      "title": contentItem.title,
      "text": contentItem.text,
      "placementAdvice": {
        "displayWidth": 800,
        "presentationDocumentTarget": contentItem.presentationTarget,
        "displayHeight": 600
      }
    }
  },

  render: function () {
    var contentItems = this.state.contentItems;
    var handleDelete = this.handleDelete;
    var documentTargets = this.props.documentTargets;
    var mediaTypes = this.matchTypes();
    var handleChange = this.handleChange;
    return (
      <table className="table table-condensed">
        <thead>
        <tr>
          <th>Title</th>
          <th>Text</th>
          <th>Type</th>
          <th>Presentation Target</th>
          <th>Window Target</th>
          <th className="add-remove-col">
            <a onClick={this.addRowHandler} href="#">
              <span className="glyphicon glyphicon-plus add-icon"> </span>
            </a>
          </th>
        </tr>
        </thead>
        <tbody>
        {contentItems.map(function (contentItem, index) {
          return <ContentItemBuilder.ContentItems.Row
            onRowDelete={handleDelete}
            onRowChange={handleChange}
            key={index}
            index={index}
            mediaTypes={mediaTypes}
            documentTargets={documentTargets}
            title={contentItem.itemTitle}
            text={contentItem.itemText}
            type={contentItem.itemType}
            width={contentItem.itemWidth}
            height={contentItem.itemHeight}
            presentationTarget={contentItem.itemPresentTarget}
            windowTarget={contentItem.itemWindowTarget}
            />
        })}
        </tbody>
      </table>
    );
  },

  matchTypes: function() {
    var ltiLinkMatch = /(application\/\*|application\/vnd\.ims\.lti\.v1\.ltilink|\*\/vnd\.ims\.lti\.v1\.ltilink)/;
    var fileItemMatch = /(text\/\*|text\/plain|\*\/plain)/;
    var applicationMatch = /application\/zip/;

    var allMatch = /\*\/\*/;

    var mediaTypes = this.props.mediaTypes;
    var supportedTypes = [];

    for (var type in mediaTypes) {
      var contentType = mediaTypes[type].toLowerCase();
      if (contentType.match(allMatch)) {
        supportedTypes.push('Lti Link');
        supportedTypes.push('File Item');
        break;
      } else if (contentType.match(fileItemMatch)) {
        supportedTypes.push('File Item');
        break;
      } else if (contentType.match(ltiLinkMatch)) {
        supportedTypes.push('Lti Link');
      } else if (contentType.match(applicationMatch)) {
        supportedTypes.push('CC');
      }
    }

    return supportedTypes;
  },

  setDefaultProp: function (contentItem, property, defaultValue) {
    if (!contentItem[property]) {
      contentItem[property] = defaultValue
    }

    return contentItem;
  },

  //called from parent via ref attribute
  toJSON: function () {
    var _this = this;
    var mediaTypes = this.matchTypes();
    var items = this.state.contentItems.map(function (contentItem) {
      contentItem = _this.setDefaultProp(contentItem, 'type', mediaTypes[0]);
      contentItem = _this.setDefaultProp(contentItem, 'presentationTarget', _this.props.documentTargets[0]);

      return {
        "@type": _this.itemTemplate(contentItem).type,
        "@id": _this.itemTemplate(contentItem).url,
        "url": _this.itemTemplate(contentItem).url,
        "title": contentItem.title,
        "text": contentItem.text,
        "mediaType": _this.itemTemplate(contentItem).mediaType,
        "placementAdvice": {
          "displayWidth": 800,
          "presentationDocumentTarget": contentItem.presentationTarget,
          "displayHeight": 600
        }
      }
    });
    return {
      contentItems: {
        "@context": "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
        "@graph": items || []
      }
    }
  }
});