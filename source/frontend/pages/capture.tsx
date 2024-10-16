import React, { Component, createRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { CaptureStackParamList } from "../app/StackParamList";
import { AutoFocus, Camera, CameraType } from "expo-camera/legacy";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/components/style";

interface CaptureProps {
  navigation: NavigationProp<CaptureStackParamList, "Capture">;
  route: RouteProp<CaptureStackParamList, "Capture">;
}

interface CaptureState {
  hasPermission: boolean | null;
  photo: string | null;
  focusDepth: number;
  loading: boolean;
  isRefreshing: boolean;
  focusSquare: any;
}

export class Capture extends Component<CaptureProps, CaptureState> {
  cameraRef = createRef<Camera>();

  constructor(props: CaptureProps) {
    super(props);

    this.state = {
      hasPermission: null, // Initially set to null until camera permissions are resolved
      photo: null,
      focusDepth: 0.5,
      loading: false,
      isRefreshing: false,
      focusSquare: { visible: false, x: 0, y: 0 },
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync(); // request permissions
    this.setState({ hasPermission: status === "granted" });
  }

  requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  };

  takePicture = async () => {
    if (this.cameraRef.current) {
      const photo = await this.cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
      });
      this.setState({ photo: photo.uri });
    }
  };

  retakePicture = () => {
    this.setState({ photo: null });
  };

  submitPicture = async () => {
    const { photo } = this.state;
    if (photo) {
      this.setState({ loading: true });
      const formData = new FormData();
      formData.append("receipt_image", {
        uri: photo,
        name: "receipt.jpg",
        type: "image/jpeg",
      } as any);

      try {
        const response = await fetch(
          "https://receiptplus.pythonanywhere.com/api/receipts_parsing",
          {
            method: "POST",
            body: formData, // Send the formData
            headers: {
              Accept: "application/json", // If the API expects JSON response
            },
            credentials: "include", // Include cookies for authentication if needed
          }
        );
        const data = await response.json();

        // Assuming 'data' is the parsed receipt information
        this.props.navigation.navigate("UserValid", {
          receiptData: data, // Pass the parsed data to the next screen
          onReturnToCamera: this.resetCamera,
        });
      } catch (error) {
        console.error("Error submitting photo:", error);
        alert("Failed to submit photo.");
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  // Function to reset the camera state (clear the photo)
  resetCamera = () => {
    this.setState({ photo: null }); // Reset the state to show the camera again
  };

  onTapToFocus = (x: number, y: number): void => {
    if (this.state.isRefreshing) {
      this.setState({ isRefreshing: false });
    }

    this.setState({
      focusSquare: { visible: true, x, y },
      isRefreshing: true,
    });

    // Hide the square after 1 second
    setTimeout(() => {
      this.setState((prevState: CaptureState) => ({
        ...prevState,
        focusSquare: { ...prevState.focusSquare, visible: false },
        isRefreshing: false,
      }));
    }, 1000);
  };

  render() {
    const { hasPermission, photo, loading, isRefreshing, focusSquare } =
      this.state;

    if (hasPermission === null) {
      // Permissions are still loading
      return <View />;
    }

    if (!hasPermission) {
      // Permissions not granted yet
      return (
        <View style={styles.container}>
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <Button title="Grant Permission" onPress={this.requestPermission} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
        {photo ? (
          <>
            <Image source={{ uri: photo }} style={styles.preview} />
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={this.retakePicture}
              >
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.submitPicture}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <GestureHandlerRootView style={{ flex: 1 }}>
            <TapGestureHandler
              onHandlerStateChange={(event) => {
                const { x, y } = event.nativeEvent; // Use x and y
                this.onTapToFocus(x, y); // Pass X and Y coordinates to the function
              }}
              shouldCancelWhenOutside={false}
            >
              <Camera
                ref={this.cameraRef}
                style={styles.camera}
                type={CameraType.back}
                autoFocus={isRefreshing ? AutoFocus.off : AutoFocus.on}
                //   onTouchEnd={this.onTapToFocus} // Handle touch to set focus point
              >
                {focusSquare.visible && (
                  <View
                    style={[
                      styles.focusSquare,
                      { top: focusSquare.y - 40, left: focusSquare.x - 40 },
                    ]}
                  />
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={this.takePicture}
                  >
                    <View style={styles.innerCircle}></View>
                  </TouchableOpacity>
                </View>
              </Camera>
            </TapGestureHandler>
          </GestureHandlerRootView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 30,
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40, // Makes the button circular
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30, // Makes the inner part circular
    backgroundColor: "white",
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: Colors.secondary,
  },
  retakeButton: {
    width: 150,
    padding: 10,
    backgroundColor: "gray",
    alignItems: "center",
    borderRadius: 10,
  },
  submitButton: {
    width: 150,
    padding: 10,
    backgroundColor: Colors.blue,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  focusSquare: {
    position: "absolute",
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: Colors.secondary,
    borderRadius: 10,
  },
});
