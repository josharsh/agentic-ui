import React from 'react';
import { useEffect, useState } from 'react';
import { Avatar, Box, Flex, Heading, Text } from '@radix-ui/themes';

function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <Box className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <Flex direction="column" align="center" gap="4">
        <Avatar
          size="8"
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`}
          fallback={`${user.first_name[0]}${user.last_name[0]}`}
        />
        <Heading size="6">{user.first_name} {user.last_name}</Heading>
        <Text size="3" color="gray">{user.email}</Text>
        <Text size="2">{user.role}</Text>
        <Text size="2">Organization: {user.organisation_name}</Text>
      </Flex>
    </Box>
  );
}

export default ProfilePage;