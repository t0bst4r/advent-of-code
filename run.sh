YEAR=$1
DAY=$2
PART=$3

{ cd year-$YEAR/day-$DAY && (time node part-$PART.js) > part-$PART.log 2>&1; }