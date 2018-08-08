import React, { Component } from 'react'
import PropTypes from 'prop-types'

import fastdomPromised from 'fastdom/extensions/fastdom-promised'
import fastdom from 'fastdom'

import List from './list'

const myFastdom = fastdom.extend(fastdomPromised);

class Unlimited extends Component {
  wrapper = React.createRef();

  state = {
    startIndex: -1,
    endIndex: -1,
  }

  componentDidMount() {
    const { scrollerRef, scrollToIndex } = this.props
    console.log('mount', scrollerRef)
    
    if (scrollerRef) {
      this.addListeners()

      if (scrollToIndex) {
        this.scrollToIndex(scrollToIndex)
      } else {
        this.updateList()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { scrollerRef, scrollToIndex, length } = this.props

    if (scrollerRef && scrollerRef !== prevProps.scrollerRef) {
      this.removeListeners(prevProps)
      this.addListeners()
      this.updateList()
    }

    if (length !== prevProps.length) {
      this.updateList()
    }

    if (scrollToIndex && scrollToIndex !== prevProps.scrollToIndex) {
      this.scrollToIndex(scrollToIndex)
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  getScrollingData = () => myFastdom.measure(() => {
    const { scrollerRef } = this.props
    const { current } = this.wrapper

    if (this.isWindowScroll()) {
      return {
        wrapperTop: !!current ? current.offsetTop : 0,
        scrollTop: scrollerRef.scrollY,
        scrollHeight: scrollerRef.innerHeight,
      }
    }
    return {
      wrapperTop: !!current ? current.offsetTop - scrollerRef.offsetTop : scrollerRef.offsetTop,
      scrollTop: scrollerRef.scrollTop,
      scrollHeight: scrollerRef.clientHeight,
    }
  })

  getIndexPosition = (index) => this.getScrollingData()
    .then(({ wrapperTop }) => {
      const { rowHeight, length } = this.props
      if (index < 0) {
        return wrapperTop
      } if (index >= length) {
        return ((length - 1) * rowHeight) + wrapperTop
      }
      return (index * rowHeight) + wrapperTop
    })

  addListeners = (props = this.props) => {
    const { scrollerRef } = props

    this.scrollTicking = false
    if (scrollerRef) scrollerRef.addEventListener('scroll', this.scrollListener)

    this.resizeTicking = false
    window.addEventListener('resize', this.resizeListener)
  }

  removeListeners = (props = this.props) => {
    const { scrollerRef } = props

    if (scrollerRef) scrollerRef.removeEventListener('scroll', this.scrollListener)
    window.removeEventListener('resize', this.resizeListener)

    if (this.scrollRAF) cancelAnimationFrame(this.scrollRAF)
    if (this.resizeRAF) cancelAnimationFrame(this.resizeRAF)
  }

  isWindowScroll = () => this.props.scrollerRef instanceof Window

  scrollToIndex = (index) => {
    const { scrollerRef } = this.props
    this.getIndexPosition(index).then(top => {
      if (this.isWindowScroll()) {
        setTimeout(() => scrollerRef.scrollTo(0, top))
      } else {
        myFastdom.mutate(() => scrollerRef.scrollTop = top)
      }
    })
  }

  scrollListener = () => {
    if (!this.scrollTicking) {
      this.scrollRAF = window.requestAnimationFrame(() => {
        this.updateList()
        this.scrollTicking = false
      })
    }
    this.scrollTicking = true
  }

  resizeListener = () => {
    if (!this.resizeTicking) {
      this.resizeRAF = window.requestAnimationFrame(() => {
        this.updateList()
        this.resizeTicking = false
      })
    }
    this.resizeTicking = true
  }

  updateList = () => {
    const {
      length,
      overscan,
      rowHeight,
      onLoadMore,
    } = this.props

    this.getScrollingData().then(({ scrollTop, scrollHeight, wrapperTop }) => {
      const start = Math.floor((scrollTop - wrapperTop) / rowHeight)
      const end = start + Math.floor(scrollHeight / rowHeight)
  
      if (onLoadMore && end + overscan >= length) {
        onLoadMore()
      }
  
      this.setState({
        startIndex: start - overscan >= 0 ? start - overscan : 0,
        endIndex: end + overscan < length ? end + overscan : (length - 1),
      })
    })
  }

  renderList = (className) => {
    const { length, renderRow, rowHeight } = this.props
    const { startIndex, endIndex } = this.state

    return (
      <List
        ref={this.wrapper}
        startIndex={startIndex}
        endIndex={endIndex}
        height={rowHeight * length}
        rowHeight={rowHeight}
        renderRow={renderRow}
        className={className}
      />
    )
  }

  render() {
    const { className } = this.props

    return this.renderList(className)
  }
}

Unlimited.propTypes = {
  length: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  renderRow: PropTypes.func.isRequired,
  scrollerRef: PropTypes.any,
  overscan: PropTypes.number,
  scrollToIndex: PropTypes.number,
  onLoadMore: PropTypes.func,
  className: PropTypes.string,
}

Unlimited.defaultProps = {
  overscan: 10,
  scrollToIndex: undefined,
  onLoadMore: undefined,
  className: undefined,
}

export default Unlimited
