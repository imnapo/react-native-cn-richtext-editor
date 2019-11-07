const editorHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
        html {
            height: 100%;
            width: 100%;
        }
        body {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            height: 100%;
            margin: 0;
            padding: 2px;
        }
        #editor {
           flex-grow: 1;
        }

        #editor:focus {
          outline: 0px solid transparent;
        }
    </style>
    <title>CN-Editor</title>
</head>
<body>
    <div id="editor">
       
    </div>
    <script>
        (function(doc) {
            var editor = document.getElementById('editor');
            editor.contentEditable = true;

            var getSelectedStyles = () => {
                let styles = [];
                document.queryCommandState('bold') && styles.push('bold');
                document.queryCommandState('italic') && styles.push('italic');
                document.queryCommandState('underline') && styles.push('underline');
                document.queryCommandState('strikeThrough') && styles.push('lineThrough');

                const fColor = document.queryCommandValue('foreColor');
                const bgColor = document.queryCommandValue('backColor');
                const colors = {
                        color: fColor,
                        highlight: bgColor
                    };
                const stylesJson = JSON.stringify({
                    type: 'selectedStyles',
                    data: {styles, colors}});
                    sendMessage(stylesJson);
                

            }

            var sendMessage = (message) => {
              window.ReactNativeWebView.postMessage(message);
            }

            var getSelectedTag = () => {
                let tag = document.queryCommandValue('formatBlock');
                if(document.queryCommandState('insertUnorderedList'))
                    tag = 'ul';
                else if(document.queryCommandState('insertorderedlist'))
                    tag = 'ol';
                switch (tag) {
                    case 'h1':
                        tag = 'title';
                        break;
                        case 'h3':
                        tag = 'heading';
                        break;
                        case 'p':
                        tag = 'body';
                        break;
                    default:
                        break;
                }
                const stylesJson = JSON.stringify({
                    type: 'selectedTag',
                    data: tag});
                sendMessage(stylesJson);
            }

            document.addEventListener('selectionchange', () => {
                getSelectedStyles();
                getSelectedTag();
            });

            var applyToolbar = (toolType, value = '') => {
                switch (toolType) {
                    case 'bold':
                        document.execCommand('bold', false, '');
                        break;
                        case 'italic':
                        document.execCommand('italic', false, '');
                        break;
                        case 'underline':
                        document.execCommand('underline', false, '');
                        break;
                        case 'lineThrough':
                        document.execCommand('strikeThrough', false, '');
                        break;
                        case 'body':
                        document.queryCommandState('insertUnorderedList') && document.execCommand('insertUnorderedList');
                        document.queryCommandState('insertorderedlist') && document.execCommand('insertorderedlist');
                        document.execCommand('formatBlock', false, 'p');
                        break;
                        case 'title':
                        document.queryCommandState('insertUnorderedList') && document.execCommand('insertUnorderedList');
                        document.queryCommandState('insertorderedlist') && document.execCommand('insertorderedlist');

                        document.execCommand('formatBlock', false, 'h1');
                        break;
                        case 'heading':
                        document.queryCommandState('insertUnorderedList') && document.execCommand('insertUnorderedList');
                        document.queryCommandState('insertorderedlist') && document.execCommand('insertorderedlist');
                        document.execCommand('formatBlock', false, 'h3');
                        break;
                        case 'ol':
                        document.execCommand('formatBlock', false, 'p');
                        document.execCommand('insertorderedlist');
                        break;
                        case 'ul':
                        document.execCommand('formatBlock', false, 'p');
                        document.execCommand('insertUnorderedList');
                        break;
                        case 'color':
                        document.execCommand('foreColor', false, value);
                        break;
                        case 'highlight':
                        document.execCommand('backColor', false, value);
                        break;
                        case 'image':
                        var img = "<img src='" + value.url + "' id='" + value.id + "' width='" + Math.round(value.width) + "' height='" + Math.round(value.height) + "' alt='" + value.alt + "' />";
                         if(document.all) {
                             var range = editor.selection.createRange();
                             range.pasteHTML(img);
                             range.collapse(false);
                             range.select();
                           } else {
                             doc.execCommand("insertHTML", false, img);
                           }
                        break;
                    default:
                        break;
                }
                getSelectedStyles();
                getSelectedTag();
            }

            var getRequest = (event) => {
                 
              var msgData = JSON.parse(event.data);
              if(msgData.type === 'toolbar') {
                applyToolbar(msgData.command, msgData.value || '');
              }
              else if(msgData.type === 'editor') {
                switch (msgData.command) {
                case 'focus':
                  editor.focus();
                  break;
                case 'blur':
                  editor.blur();
                  break;
                case 'getHtml':
                  sendMessage(
                    JSON.stringify({
                    type: 'getHtml',
                    data: editor.innerHTML})
                    );
                  break;
                case 'setHtml':
                  editor.innerHTML = msgData.value;
                  break;
                default: break;
              }
            }
                 
                 
            };

            document.addEventListener("message", getRequest , false);
            window.addEventListener("message", getRequest , false);
            
        })(document)
    </script>

</body>
</html>
`;

export default editorHTML;