#! /usr/bin/env bash

# Weekly backup for node-red

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
echo "Starting weekly backup of $SOURCE_PATH/ to $DEST_PATH/ ..."
echo "Rotating snapshots ..."

# Delete oldest weekly backup
if [ -d $DEST_PATH/weekly.5 ] ; then
    echo "  Deleting oldest weekly backup $DEST_PATH/weekly.5"

    # The slow but understandable way:
    #rm -rf $DEST_PATH/weekly.5
    # The faster way (needs an empty folder)
    rsync -rd --delete $DEST_PATH/empty/ $DEST_PATH/weekly.5/
fi

# Shift all other weekly backups ahead one day
for OLD in 5 4 3 2 1	; do
	if [ -d $DEST_PATH/weekly.$OLD ] ; then
		NEW=$(($OLD+1))

		echo "  Moving $DEST_PATH/weekly.$OLD to $DEST_PATH/weekly.$NEW"
		
		# Backup last date
		# ISSUE: touch does not support options on synology (busybox) system
		touch $DEST_PATH/.wtimestamp -r $DEST_PATH/weekly.$OLD
		mv $DEST_PATH/weekly.$OLD $DEST_PATH/weekly.$NEW
		# Restore timestamp
		touch $DEST_PATH/weekly.$NEW -r $DEST_PATH/.wtimestamp

	fi
done

# Copy hardlinked snapshot of level 0 to level 1 (before updating 0 via rsync)
if [ -d $DEST_PATH/weekly.0 ] ; then

	echo "  Copying hardlinks from $DEST_PATH/weekly.0 to $DEST_PATH/weekly.1"

	cp -al $DEST_PATH/weekly.0 $DEST_PATH/weekly.1
fi

echo "Finished rotating snapshots ..."

if ! [ -d $DEST_PATH/weekly.0 ] ; then
	mkdir -p $DEST_PATH/weekly.0
fi

# Set today's date on the current backup folder
touch $DEST_PATH/weekly.0

ENDDATE=$(date --iso-8601=s)

# Back up
echo "Performing rsync backup ..."
rsync --archive --hard-links --delete --delete-excluded \
      --exclude 'node_modules' --exclude 'data/node_modules' \
      $SOURCE_PATH/ $DEST_PATH/weekly.0

# Validate return code
# 0 = no error,
# 24 is fine, happens when files are being touched during sync (logs etc)
# all other codes are fatal -- see man (1) rsync
if ! [ $? = 24 -o $? = 0 ] ; then
	echo "Fatal: Node-RED weekly backup finished with errors!"
    #curl --insecure -I 'https://localhost:1880/nrnotify'
    mosquitto_pub -r -t services/nrmainbackup/weekly/fail -m $ENDDATE
else
    echo "Finished Node-RED weekly backup, no errors."
    #curl --insecure -I 'https://localhost:1880/nrnotify'
    mosquitto_pub -r -t services/nrmainbackup/weekly/success -m $ENDDATE
fi

# Sync disks to make sure data is written to disk
sync

#EOF
