<script setup lang="ts">
import Button from '../global/Button.vue';
import type { terminalInfo } from '../../types/terminal';
import jirachi from '../../assets/jirachi.png';

import darkmode from '../../assets/icons/darkmode.svg?raw';
import computer from '../../assets/icons/computer.svg?raw';
import student from '../../assets/icons/student.svg?raw';
import sword from '../../assets/icons/sword.svg?raw';
import cpu from '../../assets/icons/cpu.svg?raw';


const info: terminalInfo[] = [
  {
    title: "computer science student @unige",
    icon: student,
    color: "text-[#89b4fa]"
  },
  {
    title: "ctf player",
    icon: sword,
    color: "text-[#f9e2af]"
  },
  {
    title: "interested in low level and binary exploitation",
    icon: cpu,
    color: "text-[#fab387]"
  },
  {
    title: "working as fullstack dev",
    icon: computer,
    color: "text-[#f38ba8]"
  },

]
</script>

<template>
  <div class="w-fit h-fit flex flex-col justify-center items-start gap-0 border border-gray-100/15 rounded-lg overflow-hidden">

    <!-- Bar -->
     <div class="bg-black w-full h-fit flex flex-row items-center justify-between px-4 py-2">
      <p class="text-white text-sm font-mono">
        Ghostty
      </p>
      <Button :icon="darkmode" color="white" size="sm" mode="soft" />
     </div>

    <!-- Content -->
    <div class="bg-[#0a0a0a] w-full h-fit flex flex-col justify-center items-start p-3 gap-2">

      <div class="w-fit h-fit flex flex-col gap-3">
        <!--     Bar -->       
        <div class="flex flex-row justify-start items-start">
          <div class="flex flex-col justify-start items-start gap-[6px]">
            <p class="text-text-primary font-mono">
              ┌─ <span class="text-blue-200 text-sm">~/index</span>
            </p>
            <p class="text-text-primary leading-0 font-mono">
              └─ <span class="text-amber-200">$</span> <span class="text-green-200">fastfetch</span>
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="w-full h-fit flex flex-col md:flex-row items-center gap-2">
          <div class="w-42 h-fit">
            <img :src="jirachi.src" />
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-amber-200 font-semibold font-mono">
              e3py@github.io
            </p>
            <div 
              v-for="i in info" 
              :key="i.title" 
              class="flex flex-row gap-2"
            >
              <div class="w-5" :class="i.color" v-html="i.icon" />

              <p 
                class="text-text-primary text-sm font-mono"
              >
                {{ i.title }}
                <span class="text-yellow-100 underline">
                  <a v-if="i.title === 'ctf player'" href="https://pwnissa.it"> @pwnissa</a>
                </span>
              </p>
            </div>

          </div>
        </div>

        <!--     Bar -->       
        <div class="flex flex-row justify-start items-start mb-3">
          <div class="flex flex-col justify-start items-start gap-[6px]">
            <p class="text-text-primary font-mono">
              ┌─ <span class="text-blue-200 text-sm">~/index</span>
            </p>
            <p class="text-text-primary leading-0 font-mono">
              └─ <span class="text-amber-200">$</span>
            </p>
          </div>
        </div>

      </div>


    </div>
  </div>
</template>
