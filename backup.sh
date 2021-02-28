#! /usr/bin/env bash

# Redirect stdout to syslog - 
#   show with: `sudo journalctl -t nrmain-backup`
#   or `sudo cat /var/log/syslog | grep nrmain-backup`
exec 1> >(logger -t nrmain-backup -p local0.info)
# redirect stderr to syslog
exec 2> >(logger -t nrmain-backup -p local0.err)

# --- SET THESE TO THE CORRECT LOCATIONS --- #
SOURCE_PATH=/home/home/nrmain
DEST_PATH=/home/home/nrmain-backup
# ------------------------------------------ #

STARTDATE=$(date +'%Y-%m-%d %T')

echo " "
echo "Starting daily backup of $SOURCE_PATH/ to $DEST_PATH/ ..."
echo "Rotating snapshots ..."

# Delete oldest daily backup
if [ -d $DEST_PATH/daily.7 ] ; then
    echo "  Deleting oldest daily backup $DEST_PATH/daily.7"

    # The slow but understandable way:
    #rm -rf $DEST_PATH/daily.7
    # The faster way (needs an empty folder)
    rsync -rd --delete $DEST_PATH/empty/ $DEST_PATH/daily.7/
fi

# Shift all other daily backups ahead one day
for OLD in 6 5 4 3 2 1	; do
	if [ -d $DEST_PATH/daily.$OLD ] ; then
		NEW=$(($OLD+1))

		echo "  Moving $DEST_PATH/daily.$OLD to $DEST_PATH/daily.$NEW"
		
		# Backup last date
		# ISSUE: touch does not support options on synology (busybox) system
		touch $DEST_PATH/.dtimestamp -r $DEST_PATH/daily.$OLD
		mv $DEST_PATH/daily.$OLD $DEST_PATH/daily.$NEW
		# Restore timestamp
		touch $DEST_PATH/daily.$NEW -r $DEST_PATH/.dtimestamp

	fi
done

# Copy hardlinked snapshot of level 0 to level 1 (before updating 0 via rsync)
if [ -d $DEST_PATH/daily.0 ] ; then

	echo "  Copying hardlinks from $DEST_PATH/daily.0 to $DEST_PATH/daily.1"

	cp -al $DEST_PATH/daily.0 $DEST_PATH/daily.1
fi

echo "Finished rotating snapshots ..."

if ! [ -d $DEST_PATH/daily.0 ] ; then
	mkdir -p $DEST_PATH/daily.0
fi

# Set today's date on the current backup folder
touch $DEST_PATH/daily.0

ENDDATE=$(date --iso-8601=s)

# Back up
echo "Performing rsync backup ..."
rsync --archive --hard-links --delete --delete-excluded \
      --exclude 'node_modules' --exclude 'data/node_modules' \
      $SOURCE_PATH/ $DEST_PATH/daily.0

# Validate return code
# 0 = no error,
# 24 is fine, happens when files are being touched during sync (logs etc)
# all other codes are fatal -- see man (1) rsync
if ! [ $? = 24 -o $? = 0 ] ; then
	echo "Fatal: Node-RED daily backup finished with errors!"
    mosquitto_pub -r -t services/nrmainbackup/daily/fail -m $ENDDATE
else
    echo "Finished Node-RED daily backup, no errors."
    mosquitto_pub -r -t services/nrmainbackup/daily/success -m $ENDDATE
fi

# Sync disks to make sure data is written to disk
sync

#EOF
