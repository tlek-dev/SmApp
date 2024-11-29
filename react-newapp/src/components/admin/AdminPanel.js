import React, { useState, useEffect, useCallback } from 'react';
import { Theme, Container, Heading, Text, Table, 
    Flex, Box, Button, Dialog, IconButton, ScrollArea, Select, TextField, Tabs } from '@radix-ui/themes';
import { MagnifyingGlassIcon, Cross2Icon, Pencil1Icon, GearIcon, PersonIcon, ClipboardIcon } from '@radix-ui/react-icons';
import '@radix-ui/themes/styles.css';

const AdminPanel = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('scores');
    
    // Data states
    const [scores, setScores] = useState([]);
    const [users, setUsers] = useState([]);
    const [settings, setSettings] = useState([]);
    const [logs, setLogs] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    
    // UI states
    const [loading, setLoading] = useState(false);
    const [editingSettings, setEditingSettings] = useState({});
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setIsLoggedIn(true);
            loadData();
        }
    }, []);

    const loadData = async () => {
        if (isLoggedIn) {
            switch(activeTab) {
                case 'scores':
                    await fetchScores();
                    break;
                case 'users':
                    await fetchUsers();
                    break;
                case 'settings':
                    await fetchSettings();
                    break;
                case 'logs':
                    await fetchLogs();
                    break;
            }
        }
    };

    useEffect(() => {
        loadData();
    }, [isLoggedIn, activeTab]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3005/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                setIsLoggedIn(true);
                loadData();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setScores([]);
        setUsers([]);
        setSettings([]);
        setLogs([]);
    };

    // Data fetching functions
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3005/api/admin/users', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await fetch('http://localhost:3005/api/admin/settings', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:3005/api/admin/logs', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (err) {
            console.error('Error fetching logs:', err);
        }
    };

    const fetchScores = async () => {
        try {
            const response = await fetch('http://localhost:3005/api/scores?sortBy=score&sortOrder=desc', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setScores(data.scores || []);
            }
        } catch (err) {
            console.error('Error fetching scores:', err);
        }
    };

    const handleDeleteScore = async (id) => {
        try {
            const response = await fetch(`http://localhost:3005/api/admin/scores/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                fetchScores();
            }
        } catch (err) {
            console.error('Error deleting score:', err);
        }
    };

    const updateUserStatus = async (userId, status) => {
        try {
            const response = await fetch(`http://localhost:3005/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });
            if (response.ok) {
                fetchUsers();
            }
        } catch (err) {
            console.error('Error updating user status:', err);
        }
    };

    const updateSetting = async (key, value) => {
        try {
            const response = await fetch(`http://localhost:3005/api/admin/settings/${key}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value }),
                credentials: 'include'
            });
            if (response.ok) {
                fetchSettings();
                setEditingSettings({});
            }
        } catch (err) {
            console.error('Error updating setting:', err);
        }
    };

    const createAnnouncement = async () => {
        try {
            const response = await fetch('http://localhost:3005/api/admin/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAnnouncement),
                credentials: 'include'
            });
            if (response.ok) {
                setNewAnnouncement({ title: '', content: '' });
                // Optionally fetch announcements
            }
        } catch (err) {
            console.error('Error creating announcement:', err);
        }
    };

    if (!isLoggedIn) {
        return (
            <Container size="1">
                <Box style={{ maxWidth: 400, margin: '40px auto', padding: '20px' }}>
                    <Heading size="4" mb="5" align="center">Вход в админ-панель</Heading>
                    <form onSubmit={handleLogin}>
                        <Flex direction="column" gap="4">
                            <Box>
                                <Text as="label" size="2" mb="2" weight="bold">
                                    Имя пользователя
                                </Text>
                                <TextField.Root>
                                    <TextField.Slot>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: 'none',
                                                outline: 'none',
                                                background: 'transparent',
                                                fontSize: '14px'
                                            }}
                                            placeholder="Введите имя пользователя"
                                        />
                                    </TextField.Slot>
                                </TextField.Root>
                            </Box>

                            <Box>
                                <Text as="label" size="2" mb="2" weight="bold">
                                    Пароль
                                </Text>
                                <TextField.Root>
                                    <TextField.Slot>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: 'none',
                                                outline: 'none',
                                                background: 'transparent',
                                                fontSize: '14px'
                                            }}
                                            placeholder="Введите пароль"
                                        />
                                    </TextField.Slot>
                                </TextField.Root>
                            </Box>

                            {error && (
                                <Text color="red" size="2" weight="medium">
                                    {error}
                                </Text>
                            )}
                            
                            <Button 
                                disabled={loading} 
                                size="3"
                                style={{ 
                                    width: '100%',
                                    marginTop: '8px'
                                }}
                            >
                                {loading ? 'Вход...' : 'Войти'}
                            </Button>
                        </Flex>
                    </form>
                </Box>
            </Container>
        );
    }

    return (
        <Container size="3">
            <Flex justify="between" align="center" style={{ marginBottom: '20px' }}>
                <Heading size="4">Admin Panel</Heading>
                <Button onClick={handleLogout}>Logout</Button>
            </Flex>

            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Trigger value="scores">
                        <ClipboardIcon /> Scores
                    </Tabs.Trigger>
                    <Tabs.Trigger value="users">
                        <PersonIcon /> Users
                    </Tabs.Trigger>
                    <Tabs.Trigger value="settings">
                        <GearIcon /> Settings
                    </Tabs.Trigger>
                    <Tabs.Trigger value="logs">
                        <MagnifyingGlassIcon /> Logs
                    </Tabs.Trigger>
                </Tabs.List>

                <Box style={{ padding: '20px 0' }}>
                    <Tabs.Content value="scores">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {scores.map((score) => (
                                    <Table.Row key={score.id}>
                                        <Table.Cell>{score.nickname}</Table.Cell>
                                        <Table.Cell>{score.score}</Table.Cell>
                                        <Table.Cell>{new Date(score.date).toLocaleString()}</Table.Cell>
                                        <Table.Cell>
                                            <IconButton onClick={() => handleDeleteScore(score.id)}>
                                                <Cross2Icon />
                                            </IconButton>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Tabs.Content>

                    <Tabs.Content value="users">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {users.map((user) => (
                                    <Table.Row key={user.id}>
                                        <Table.Cell>{user.username}</Table.Cell>
                                        <Table.Cell>{user.role}</Table.Cell>
                                        <Table.Cell>{user.status}</Table.Cell>
                                        <Table.Cell>
                                            <Select.Root 
                                                value={user.status}
                                                onValueChange={(value) => updateUserStatus(user.id, value)}
                                            >
                                                <Select.Trigger />
                                                <Select.Content>
                                                    <Select.Item value="active">Active</Select.Item>
                                                    <Select.Item value="blocked">Blocked</Select.Item>
                                                </Select.Content>
                                            </Select.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Tabs.Content>

                    <Tabs.Content value="settings">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Setting</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {settings.map((setting) => (
                                    <Table.Row key={setting.key}>
                                        <Table.Cell>{setting.key}</Table.Cell>
                                        <Table.Cell>
                                            {editingSettings[setting.key] ? (
                                                <TextField.Root>
                                                    <TextField.Slot>
                                                        <input
                                                            type="text"
                                                            value={editingSettings[setting.key]}
                                                            onChange={(e) => setEditingSettings({
                                                                ...editingSettings,
                                                                [setting.key]: e.target.value
                                                            })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: 'none',
                                                                outline: 'none',
                                                                background: 'transparent'
                                                            }}
                                                        />
                                                    </TextField.Slot>
                                                </TextField.Root>
                                            ) : setting.value}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {editingSettings[setting.key] ? (
                                                <Flex gap="2">
                                                    <Button onClick={() => updateSetting(setting.key, editingSettings[setting.key])}>
                                                        Save
                                                    </Button>
                                                    <Button 
                                                        color="red" 
                                                        onClick={() => setEditingSettings({
                                                            ...editingSettings,
                                                            [setting.key]: undefined
                                                        })}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Flex>
                                            ) : (
                                                <IconButton onClick={() => setEditingSettings({
                                                    ...editingSettings,
                                                    [setting.key]: setting.value
                                                })}>
                                                    <Pencil1Icon />
                                                </IconButton>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Tabs.Content>

                    <Tabs.Content value="logs">
                        <ScrollArea style={{ height: '500px' }}>
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Admin</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {logs.map((log) => (
                                        <Table.Row key={log.id}>
                                            <Table.Cell>{log.username}</Table.Cell>
                                            <Table.Cell>{log.action}</Table.Cell>
                                            <Table.Cell>{log.details}</Table.Cell>
                                            <Table.Cell>{new Date(log.created_at).toLocaleString()}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </ScrollArea>
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </Container>
    );
};

export default AdminPanel;
