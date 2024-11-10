import Mark from '@/utils/mark.js';
import { ref, onMounted, nextTick } from 'vue';
import { showToast } from 'vant';

export default function markHook(emits, props, { onShowAnnotations,onShowUnderlinePanel }) {
  let selectedText = '';
  let underlines = [];

  // 标记功能
  onMounted(() => {
    // 批注划线
    showToast("8秒后开始划线")
    setTimeout(() => {
			console.log(
				window.getSelection(),
				window.getSelection().toString(),
				window.getSelection().getRangeAt(0),
				window.getSelection().getRangeAt(0).toString()
			)
			const selectionData = getSelectionParams()
			console.log(selectionData)
			// menuController('划线');
			menuController('批注')
		}, 8000);
    loadCacheMark();
  });

  function menuController(type = '划线', selectedParams) {
    if (!selectedParams) selectedParams = getSelectionParams();
    if (selectedParams.includeMarkTag) {
      return showToast(type == '划线' ? `划线失败，禁止重叠` : `批注失败，禁止重叠`);
    }
    if (selectedParams.includeElementTag) {
      return showToast(type == '划线' ? `划线失败，包含非文本` : `批注失败，包含非文本`);
    }
    // 根据type做对应操作
    if (type == '划线') {
      markAction({
        selectedData: selectedParams.selectedData,
        type: 1,
        selectedText: selectedParams.selectedText,
        eventDataIndex: underlines.length,
      });
    } else if (type == '批注') {
      onEditAnnotationsChange(selectedParams);
    }
  }

  // 获取中间节点
  function getTextNodesInRange(startNode, endNode, selectedData, whiteList) {
    var pId = [];
    var currentNode = getNextTextNode(startNode, endNode, whiteList);
    // debugger
    if (currentNode && currentNode.isMarkTag) return false;
    while (currentNode && currentNode != endNode) {
      const pNode = currentNode.parentNode;
      // 如果中间节点和开始节点在同一行
      //   debugger
      if (pNode.id == startNode.parentNode.id) {
        selectedData.push({
          id: pNode.id,
          rang: {
            start: 0 + getTextPreOffset(pNode, currentNode),
            length: currentNode.textContent.length,
            text: currentNode.textContent,
          },
        });
      } else if (pNode.id == endNode.parentNode.id) {
        // 如果中间节点和结束节点在同一行
        selectedData.push({
          id: pNode.id,
          rang: {
            start: 0 + getTextPreOffset(pNode, currentNode),
            length: currentNode.textContent.length,
            text: currentNode.textContent,
          },
        });
      } else if (pNode.id && !pId.includes(pNode.id)) {
        // 如果中间节点单独一行
        selectedData.push({
          id: pNode.id,
          rang: {
            start: 0,
            length: pNode.textContent.length,
            text: pNode.textContent,
          },
        });
        pId.push(pNode.id);
      }
      currentNode = getNextTextNode(currentNode, endNode, whiteList);
      if (currentNode && currentNode.isMarkTag) return false;
      //   console.log('currentNode', currentNode, selectedData, pNode);
    }
    return true;
  }

  // 获取下一个文本节点
  function getNextTextNode(node, endNode, whiteList, isGoBack = false) {
    // debugger
    if (node.nextSibling && node.nodeType == Node.ELEMENT_NODE && checkWhiteList(whiteList, node)) {
      return getNextTextNode(node.nextSibling, endNode, whiteList, false);
    } else if (node.nodeType == Node.ELEMENT_NODE && node.parentNode && checkWhiteList(whiteList, node)) {
      return getNextTextNode(node.parentNode, endNode, whiteList, true);
    } else if (node.tagName == 'MARK' || node.nodeName == 'MARK') return { isMarkTag: true };
    if (node.nextSibling && node.nextSibling.nodeType == Node.TEXT_NODE) {
      return node.nextSibling;
    } else if (!node.nextSibling && node.parentNode && node.nodeType == Node.TEXT_NODE) {
      // 到了文本节点的末尾，没有下一个节点了，回到父节点
      return getNextTextNode(node.parentNode, endNode, whiteList, true);
    } else if (isGoBack && node.nextSibling && node.nodeType == Node.ELEMENT_NODE) {
      // 从子节点回到父节点，且是一个元素节点，那么下个节点的下一个子节点
      return getNextTextNode(node.nextSibling, endNode, whiteList, false);
    } else if (isGoBack && !node.nextSibling && node.parentNode && node.nodeType == Node.ELEMENT_NODE) {
      // 从子节点回到父节点，且是最后一个元素节点，那么回到父节点
      return getNextTextNode(node.parentNode, endNode, whiteList, true);
    } else if (!isGoBack && node.nodeType == Node.ELEMENT_NODE && (node.tagName == 'P' || node.nodeName == 'P')) {
      // 获取当前p元素节点的子节点，返回
      return node.firstChild;
    } else if (!isGoBack && node.nodeType == Node.ELEMENT_NODE && node.childNodes.length > 0) {
      // 当前节点为元素节点，且子节点数量大于0，
      return getNextTextNode(node.childNodes[0], endNode, whiteList, false);
    } else if (node.nextSibling) {
      // 非文本，非元素节点，下一个
      return getNextTextNode(node.nextSibling, endNode, whiteList, false);
    } else {
      //   debugger;
      return null;
    }
  }

  function checkWhiteList(list, node) {
    var fn =
      node.matches ||
      node.matchesSelector ||
      node.msMatchesSelector ||
      node.mozMatchesSelector ||
      node.oMatchesSelector ||
      node.webkitMatchesSelector;

    for (let i = 0; i < list.length; i++) {
      if (fn.call(node, list[i])) {
        return true;
      }
    }
    return false;
  }

  function isMarkTag(node) {
    return node.parentNode.tagName == 'MARK';
  }

  // 获取偏移度
  function getTextPreOffset(root, text) {
    // debugger
    const nodeStack = [root];
    let curNode = null;
    let offset = 0;
    while ((curNode = nodeStack.pop())) {
      const children = curNode.childNodes;
      for (let i = children.length - 1; i >= 0; i--) {
        nodeStack.push(children[i]);
      }

      if (curNode.nodeType === 3 && curNode !== text) {
        offset += curNode.textContent.length;
      } else if (curNode.nodeType === 3) {
        break;
      }
    }

    return offset;
  }

  // 开始节点
  function getStarNodeData(rang, isSingleLine = false) {
    if (isMarkTag(rang.startContainer)) {
      return { includeMarkTag: true };
    }
    if (rang.startContainer.nodeType == Node.ELEMENT_NODE) {
      return { includeElementTag: true };
    }
    var rangParent = rang.startContainer.parentNode;
    var text = rang.startContainer.textContent;
    var startIndex = rang.startOffset + getTextPreOffset(rangParent, rang.startContainer);
    var length = isSingleLine ? rang.endOffset - rang.startOffset : text.length - startIndex;
    // debugger
    return {
      id: rangParent.id,
      rang: {
        start: startIndex,
        length: length,
        text: text.substring(rang.startOffset, rang.startOffset + length),
      },
    };
  }
  // 结束节点
  function geEndNodeData(rang) {
    if (isMarkTag(rang.endContainer)) {
      return { includeMarkTag: true };
    }
    if (rang.endContainer.nodeType == Node.ELEMENT_NODE) {
      return { includeElementTag: true };
    }
    var rangParent = rang.endContainer.parentNode;
    var text = rang.endContainer.textContent;
    var startIndex = 0 + getTextPreOffset(rangParent, rang.endContainer);
    return {
      id: rangParent.id,
      rang: {
        start: startIndex,
        length: rang.endOffset,
        text: text.substring(0, rang.endOffset),
      },
    };
  }

  // 获取选中信息
  const getSelectionParams = () => {
    console.time('计算耗时：');
    var selectedText = window.getSelection().toString();
    var rang = window.getSelection().getRangeAt(0);
    var startNode = rang.startContainer;
    var endNode = rang.endContainer;
    var selectedData = [];
    var selectedInfo = null;
    if (startNode === endNode) {
      selectedInfo = getStarNodeData(rang, true);
      if (selectedInfo.isIncludesMark) return { includeMarkTag: true };
      if (selectedInfo.includeElementTag) return { includeElementTag: true };
      selectedData.push(selectedInfo);
    } else {
      // 加入头节点
      selectedInfo = getStarNodeData(rang);
      if (selectedInfo.isIncludesMark) return { includeMarkTag: true };
      if (selectedInfo.includeElementTag) return { includeElementTag: true };
      selectedData.push(selectedInfo);
      //   处理中间节点
      var check = getTextNodesInRange(rang.startContainer, rang.endContainer, selectedData, [
        '.observe-container',
        '.img-full-description',
        '.section-title',
        '.img-left-description',
        '.no-mark',
        '.plane-img',
        '.slide-container'
      ]);
      if (!check) return { includeMarkTag: true };
      // 加入尾节点
      selectedInfo = geEndNodeData(rang);
      if (selectedInfo.isIncludesMark) return { includeMarkTag: true };
      if (selectedInfo.includeElementTag) return { includeElementTag: true };
      selectedData.push(selectedInfo);
    }
    console.timeEnd('计算耗时：');
    return {
      selectedData,
      selectedText,
    };
  };

  // 去标记
  const markAction = ({ selectedData, type = 1, selectedText, annotationsText, isLocal = true, eventDataIndex }) => {
    console.log('标记数据：', selectedData);
    selectedData.forEach((item, selectedDataIndex) => {
      if (item.id) {
        new Mark(document.querySelector('#' + item.id)).markRanges([item.rang], {
          className: type == 1 ? 'underlined-text' : 'underlined-dashed-text',
          acrossElements: true,
          filter: function (textNode, range, counter, nodeCount) {
            if (counter == 1) return false;
            const term = textNode.parentNode.textContent.substring(range.start, range.start + range.length);
            // console.log('filter', textNode, counter, nodeCount, range, term);
            if (!term) return false;
            if (range.text == term || range.text.includes(term)) {
              return true;
            } else {
              return false;
            }
          },
          done: function (count) {
            window.getSelection().removeAllRanges();
            console.log('标记完成', count);
            if (count == 0) return;
            if (isLocal && selectedDataIndex == selectedData.length - 1) {
              showToast(type == 1 ? `划线成功` : `批注成功`);
            }
            if (type == 1 && isLocal && selectedDataIndex == selectedData.length - 1) {
              underlines.push(selectedData);
              localStorage.setItem('underlines', JSON.stringify(underlines));
            } else if (type == 2 && isLocal && annotationsText && selectedDataIndex == selectedData.length - 1) {
              // 添加到目录
              emits('onAnnotationsAdded', {
                digest: selectedText,
                detail: annotationsText,
                unit: '第一单元',
                topic: '第 1 课',
                selectedData: selectedData,
              });
            }
          },
          each: function (e) {
            // console.log('each', e, type);
            //绑定事件
            if (type == 1) {
              e.onclick = e => {
                console.log('删除下划线：', eventDataIndex);
                onShowUnderlinePanel(e, { selectedData: underlines[eventDataIndex], eventDataIndex: eventDataIndex, type })
                // umMarkAction({ selectedData: underlines[eventDataIndex], eventDataIndex: eventDataIndex, type });
              };
            }
            if (type == 2) {
              e.onclick = e => {
                // 要注意跨多行选中的问题
                const annotationsContent = props.annotations.find(item => item.digest.includes(e.target.textContent.trim())).detail;
                onShowAnnotations(e, 2, annotationsContent);
              };
            }
          },
        });
      }
    });
  };

  // 取消标记
  const umMarkAction = ({ selectedData, eventDataIndex, removeItem, type }) => {
    console.log('取消标记：', selectedData, eventDataIndex, removeItem, type);
    selectedData.forEach((item, selectedDataIndex) => {
      new Mark(document.querySelector('#' + item.id)).unmarkByCustom({
        markContent: item.rang.text,
        done: function () {
          showToast(`取消成功`);
          if (type == 1 && selectedDataIndex == selectedData.length - 1) {
            var cache = JSON.parse(localStorage.getItem('underlines'));
            cache.splice(eventDataIndex, 1);
            if (cache.length > 0) {
              localStorage.setItem('underlines', JSON.stringify(cache));
            } else {
              localStorage.removeItem('underlines');
            }
          } else if (type == 2 && selectedDataIndex == selectedData.length - 1) {
            emits('onAnnotationsChanged', removeItem);
          }
        },
      });
    });
  };

  // 加载本地数据
  const loadCacheMark = () => {
    nextTick(() => {
      // 加载下划线缓存
      const underlinesCache = localStorage.getItem('underlines');
      if (underlinesCache) {
        underlines = JSON.parse(underlinesCache);
        underlines.forEach((item, index) => {
          markAction({ selectedData: item, type: 1, isLocal: false, eventDataIndex: index });
        });
      }

      //  加载批注缓存
      if (props.annotations.length > 0) {
        props.annotations.forEach(item => {
          markAction({ selectedData: item.selectedData, type: 2, isLocal: false });
        });
      }
    });
  };

  // 移动到划线处
  const moveMarkPosition = text => {
    const markTags = document.querySelectorAll('mark');
    const texts = text.split(/\n+/);
    markTags.forEach(tag => {
      if (texts.includes(tag.textContent.trim())) {
        console.log('找到匹配的 <mark> 标签:', tag);
        tag.scrollIntoView({ behavior: 'auto', block: 'center' });
        return;
      }
    });
  };

  // 显示批注编辑卡片
  const showEditAnnotations = ref(false);
  const annotationsContent = ref('');
  let temptSelectedParams = null;
  const onEditAnnotationsChange = selectedParams => {
    annotationsContent.value = selectedParams.selectedText;
    temptSelectedParams = selectedParams;
    window.getSelection().removeAllRanges();
    showEditAnnotations.value = !showEditAnnotations.value;
  };

  const onEditAnnotationsConfirm = text => {
    showEditAnnotations.value = !showEditAnnotations.value;
    markAction({
      selectedData: temptSelectedParams.selectedData,
      selectedText: temptSelectedParams.selectedText,
      type: 2,
      annotationsText: text,
    });
    temptSelectedParams = null;
  };

  window.readLoader = { menuController, getSelectionParams };
  return {
    selectedText,
    menuController,
    markAction,
    umMarkAction,
    moveMarkPosition,
    showEditAnnotations,
    annotationsContent,
    onEditAnnotationsConfirm,
  };
}
