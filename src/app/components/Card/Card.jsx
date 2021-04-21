import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const classes = {
  card: 'card',
  infoWrapper: 'info-wrapper',
  imgWrapper: 'image-wrapper',
  img: 'image',
  textWrapper: 'text-wrapper',
  tagsWrapper: 'tags-wrapper',
}

const KEY_CODE = {
  ENTER: 13,
  SPACE: 32,
}

const Card = ({ text, url, calories, tags, onClick }) => {
  const tagList = tags.join(', ')

  const fallbackUrl = url.includes('http')
    ? url
    : ' https://via.placeholder.com/80'

  const handleKeyDown = () => {
    if (event.keyCode === KEY_CODE.ENTER || event.keyCode === KEY_CODE.SPACE) {
      onClick()
    }
  }

  return (
    <span
      className={classes.card}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex="0"
    >
      <div className={classes.imgWrapper}>
        <img className={classes.img} src={fallbackUrl} alt="ingredient" />
      </div>
      <div className={classes.textWrapper}>
        <div className={classes.infoWrapper}>
          {text} <span>{calories}kcal</span>
        </div>
        <div className={classes.tagsWrapper}>Tags: {tagList}</div>
      </div>
    </span>
  )
}

Card.propTypes = {
  text: PropTypes.string,
  url: PropTypes.string,
  calories: PropTypes.number,
  tags: PropTypes.array,
  onClick: PropTypes.func,
}

export default Card
