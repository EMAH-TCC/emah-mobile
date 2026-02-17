import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/preFormularioStyles";

export default function RadioBoolean({ label, value, onChange }) {
    const options = [
        { label: "Sim", value: true },
        { label: "Não", value: false },
    ];

    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}

            {options.map((op) => (
                <TouchableOpacity
                    key={op.label}
                    style={styles.radioOption}
                    onPress={() => onChange(op.value)}
                >
                    <Ionicons
                        name={value === op.value ? "radio-button-on" : "radio-button-off"}
                        size={24}
                        color="#F28B0C"
                    />
                    <Text style={styles.optionText}>{op.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
