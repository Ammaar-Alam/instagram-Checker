import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Avatar,
    ListItemAvatar,
    Typography,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';

function ProfileList({ notFollowingBack, notFollowedByYou }) {
    return (
        <>
            <Typography variant="h6">People Who Don't Follow You Back</Typography>
            <List>
                {notFollowingBack.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: '#E4405F' }}>
                                <InstagramIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.username} />
                    </ListItem>
                ))}
            </List>

            <Typography variant="h6">People You Don't Follow Back</Typography>
            <List>
                {notFollowedByYou.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: '#E4405F' }}>
                                <InstagramIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.username} />
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export default ProfileList;
