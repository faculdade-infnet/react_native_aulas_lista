import { Image, StyleSheet, Text, View } from "react-native";

export default function ItemList({ card }) {

    const { name, imageUrl } = card;
    return (
        <View style={styles.container}>
            <Image
                style={styles.imageItem}
                source={{
                    uri: imageUrl
                }} />
            <View>
                <Text>{name}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginVertical: 2,
        borderWidth: 1,
        borderColor: "#adb5bd",
        borderRadius: 5,
    },
    imageItem: {
        width: 100,
        height: 130,
        resizeMode: "contain",
    },
})