is_app_initiated=$(scripts/is_app_builded.sh)

if [ "$is_app_initiated" = "initiated" ]; then
    echo "STARTED"
    exit 0
else
    echo "On LOAD"
    exit 1
fi