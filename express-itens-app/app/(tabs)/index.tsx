import { ThemedText } from '@/components/ThemedText';
import * as SQLite from "expo-sqlite";
import { Button, FlatList, Pressable, SafeAreaView, View } from 'react-native';
import { createMergeableStore } from 'tinybase/mergeable-store';
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client";
import { useCreateMergeableStore, useCreatePersister, useCreateSynchronizer, useProvideStore, useRowIds, useStore } from 'tinybase/ui-react';

const TABLE_NAME = 'tasks';
const TEXT_CELL = 'TEXT';
const DONE_CELL = 'done';

// const TABLE_SCHEMA = {
//   name: TABLE_NAME,
//   columns: [
//     { name: 'id', type: 'TEXT', primaryKey: true },
//     { name: 'task', type: 'TEXT' },
//     { name: 'completed', type: 'BOOLEAN' },
//   ],
// };

function TaskList() {
  const store = useStore(TABLE_NAME);
  const sortedRowIds = useRowIds(TABLE_NAME, store);
  return (
    <FlatList
      data={sortedRowIds}
      renderItem={({ item: id }) => {
        const task = store?.getRow(TABLE_NAME, id);
        return (
          <Pressable onPress={() => store?.delRow(TABLE_NAME, id)}>
            <ThemedText>
              {id} {task?.[TEXT_CELL]}
            </ThemedText>
          </Pressable>
        );
      }}
    />
  );
}

function AddTask() {
  const store = useStore(TABLE_NAME);

  const handleAddTask = () => {
    store?.addRow(TABLE_NAME, {
      [TEXT_CELL]: getRandomTask(),
      [DONE_CELL]: false,
    });
  };

  return <Button title="Add task" onPress={handleAddTask} />;
}


export default function HomeScreen() {

  const store = useCreateMergeableStore(() => createMergeableStore());

  useCreatePersister(
    store,
    (store) =>
      createExpoSqlitePersister(store, SQLite.openDatabaseSync("tasks.db")),
    [],
    // @ts-ignore
    (persister) => persister.load().then(persister.startAutoSave)
  );

  useCreateSynchronizer(store, async (store) => {
    const sync = await createWsSynchronizer(
      store,
      // new WebSocket("wss://server.betomoedano01.workers.dev/")
      new WebSocket("ws://localhost:8787/")
    );
    await sync.startSync();

    sync.getWebSocket().addEventListener("open", () => {
      sync.load().then(() => sync.save());
    });

    return sync;
  });

  useProvideStore(TABLE_NAME, store);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText type="title">Tasks</ThemedText>
        <AddTask />
        <TaskList />
      </View>
    </SafeAreaView>
  );
}


const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
}

const getRandomTask = () => {
  const tasks = [
    'Do the laundry',
    'Take out the trash',
    'Buy groceries',
    'Walk the dog',
    'Read a book',
  ];
  return tasks[Math.floor(Math.random() * tasks.length)];
};

